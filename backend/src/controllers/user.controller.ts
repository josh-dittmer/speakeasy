import { Request, Response } from 'express';
import { db } from '../db/db';
import { allowedImageMimes, CreateProfileRequest, CreateProfileRequestT, CreateProfileResponseT, EditProfileRequest, EditProfileRequestT, EditProfileResponseT, IsMyProfileCompleteResponseT, maxUserBioLength, maxUserNameLength, S3Keys, UploadResponseT, UserArrayT, welcomeServerId } from 'models';
import { filesTable, membershipsTable, usersTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { badRequest, notFound, serverError } from '../common/response';
import { isLeft } from 'fp-ts/Either'
import { createUploadUrl, deleteFile } from '../util/s3';

export async function getMyUserData(req: Request, res: Response) {
    const result: UserArrayT = await db.select({
        userId: usersTable.userId,
        imageId: usersTable.imageId,
        name: usersTable.name,
        bio: usersTable.bio
    })
    .from(usersTable)
    .where(eq(usersTable.userId, res.locals.userId))

    if (result.length === 0) {
        return notFound(res, `user ${res.locals.userId}`);
    }

    res.json(result[0]);
}

export async function isMyProfileComplete(req: Request, res: Response) {
    const result = await db.select({
        userId: usersTable.userId
    })
    .from(usersTable)
    .where(eq(usersTable.userId, res.locals.userId));

    let complete = true;

    if (result.length === 0) {
        complete = false;
    }

    const response: IsMyProfileCompleteResponseT = {
        complete: complete,
        email: res.locals.userEmail
    };

    res.json(response);
}

export async function editUserProfile(req: Request, res: Response) {
    const decoded = EditProfileRequest.decode(req.body);
    if (isLeft(decoded)) {
        return badRequest(res);
    }

    const data: EditProfileRequestT = decoded.right;

    if (data.name.length > maxUserNameLength || data.bio.length > maxUserBioLength) {
        return badRequest(res);
    }

    const userResult = await db.select({
        imageId: usersTable.imageId
    })
    .from(usersTable)
    .where(eq(usersTable.userId, res.locals.userId));

    if (userResult.length === 0) {
        return serverError(res);
    }

    const userInfo = userResult[0];

    let upload: UploadResponseT | undefined;
    let imageId: string | null = userInfo.imageId;

    if (data.image) {
        if (!allowedImageMimes.includes(data.image.mimeType)) {
            return badRequest(res);
        }

        if (imageId) {
            await deleteFile(`${S3Keys.profileImgs}/${imageId}`);
            await db.delete(filesTable).where(eq(filesTable.fileId, imageId));
        }

        imageId = crypto.randomUUID();

        await db.insert(filesTable).values([{
            fileId: imageId,
            userId: res.locals.userId,
            name: data.image.name,
            mimeType: data.image.mimeType
        }]);

        const { url, fields } = await createUploadUrl(`${S3Keys.profileImgs}/${imageId}`);
        upload = {
            fileId: imageId,
            url: url,
            name: data.image.name,
            fields: fields
        };
    }

    await db.update(usersTable)
        .set({
            name: data.name,
            bio: data.bio,
            imageId: imageId
        })
        .where(eq(usersTable.userId, res.locals.userId));

    const response: EditProfileResponseT = {
        upload: upload
    };

    res.json(response);
}

export async function createUserProfile(req: Request, res: Response) {
    const decoded = CreateProfileRequest.decode(req.body);
    if (isLeft(decoded)) {
        return badRequest(res);
    }

    const data: CreateProfileRequestT = decoded.right;

    if (data.name.length > maxUserNameLength) {
        return badRequest(res);
    }

    let upload: UploadResponseT | undefined;
    let imageId: string = crypto.randomUUID();
    
    await db.insert(usersTable).values([{
        userId: res.locals.userId,
        imageId: data.image ? imageId : null,
        name: data.name,
        bio: data.bio
    }]);

    await db.insert(membershipsTable).values([{
        serverId: welcomeServerId,
        userId: res.locals.userId
    }]);

    if (data.image) {
        if (!allowedImageMimes.includes(data.image.mimeType)) {
            return badRequest(res);
        }

        await db.insert(filesTable).values([{
            fileId: imageId,
            userId: res.locals.userId,
            name: data.image.name,
            mimeType: data.image.mimeType
        }]);

        const { url, fields } = await createUploadUrl(`${S3Keys.profileImgs}/${imageId}`);
        upload = {
            fileId: imageId,
            url: url,
            name: data.image.name,
            fields: fields
        };
    }

    const response: CreateProfileResponseT = {
        upload: upload
    };

    res.json(response);
}