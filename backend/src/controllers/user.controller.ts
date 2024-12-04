import { eq } from 'drizzle-orm';
import { Request, Response } from 'express';
import { isLeft } from 'fp-ts/Either';
import {
    allowedImageMimes,
    CreateProfileRequest,
    CreateProfileRequestT,
    CreateProfileResponseT,
    EditProfileRequest,
    EditProfileRequestT,
    EditProfileResponseT,
    IsMyProfileCompleteResponseT,
    maxUserBioLength,
    maxUserNameLength,
    S3Keys,
    UploadResponseT,
    UserT,
    welcomeServerId,
} from 'models';
import { badRequest, notFound, serverError } from '../common/response';
import { db } from '../db/db';
import { filesTable, membershipsTable, usersTable } from '../db/schema';
import { SIOServer } from '../socket.io/sio_server';
import { createUploadUrl, deleteFile } from '../util/s3';

export class UserController {
    private sioServer: SIOServer;

    constructor(sioServer: SIOServer) {
        this.sioServer = sioServer;
    }

    async getMyUserData(req: Request, res: Response) {
        const result = await db
            .select({
                userId: usersTable.userId,
                imageId: usersTable.imageId,
                name: usersTable.name,
                bio: usersTable.bio,
            })
            .from(usersTable)
            .where(eq(usersTable.userId, res.locals.userId));

        if (result.length === 0) {
            return notFound(res, `user ${res.locals.userId}`);
        }

        const response: UserT = {
            userId: result[0].userId,
            imageId: result[0].imageId,
            name: result[0].name,
            bio: result[0].bio,
            status: 'ONLINE',
        };

        res.json(response);
    }

    async isMyProfileComplete(req: Request, res: Response) {
        const result = await db
            .select({
                userId: usersTable.userId,
            })
            .from(usersTable)
            .where(eq(usersTable.userId, res.locals.userId));

        let complete = true;

        if (result.length === 0) {
            complete = false;
        }

        const response: IsMyProfileCompleteResponseT = {
            complete: complete,
            email: res.locals.userEmail,
        };

        res.json(response);
    }

    async editUserProfile(req: Request, res: Response) {
        const decoded = EditProfileRequest.decode(req.body);
        if (isLeft(decoded)) {
            return badRequest(res);
        }

        const data: EditProfileRequestT = decoded.right;

        if (data.name.length > maxUserNameLength || data.bio.length > maxUserBioLength) {
            return badRequest(res);
        }

        const userResult = await db
            .select({
                imageId: usersTable.imageId,
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

            await db.insert(filesTable).values([
                {
                    fileId: imageId,
                    userId: res.locals.userId,
                    name: data.image.name,
                    mimeType: data.image.mimeType,
                },
            ]);

            const { url, fields } = await createUploadUrl(`${S3Keys.profileImgs}/${imageId}`);
            upload = {
                fileId: imageId,
                url: url,
                name: data.image.name,
                fields: fields,
            };
        }

        await db
            .update(usersTable)
            .set({
                name: data.name,
                bio: data.bio,
                imageId: imageId,
            })
            .where(eq(usersTable.userId, res.locals.userId));

        this.sioServer.emitEvent({
            type: 'USER_PROFILE_EDITED',
            clientId: data.clientId,
            userId: res.locals.userId,
            serverId: null,
            channelId: null,
        });

        const response: EditProfileResponseT = {
            upload: upload,
        };

        res.json(response);
    }

    async createUserProfile(req: Request, res: Response) {
        const decoded = CreateProfileRequest.decode(req.body);
        if (isLeft(decoded)) {
            return badRequest(res);
        }

        const data: CreateProfileRequestT = decoded.right;

        if (data.name.length > maxUserNameLength) {
            return badRequest(res);
        }

        let upload: UploadResponseT | undefined;
        const imageId: string = crypto.randomUUID();

        await db.insert(usersTable).values([
            {
                userId: res.locals.userId,
                imageId: data.image ? imageId : null,
                name: data.name,
                bio: data.bio,
            },
        ]);

        await db.insert(membershipsTable).values([
            {
                serverId: welcomeServerId,
                userId: res.locals.userId,
            },
        ]);

        if (data.image) {
            if (!allowedImageMimes.includes(data.image.mimeType)) {
                return badRequest(res);
            }

            await db.insert(filesTable).values([
                {
                    fileId: imageId,
                    userId: res.locals.userId,
                    name: data.image.name,
                    mimeType: data.image.mimeType,
                },
            ]);

            const { url, fields } = await createUploadUrl(`${S3Keys.profileImgs}/${imageId}`);
            upload = {
                fileId: imageId,
                url: url,
                name: data.image.name,
                fields: fields,
            };
        }

        this.sioServer.emitEvent({
            type: 'SERVER_USER_JOIN',
            clientId: data.clientId,
            userId: res.locals.userId,
            serverId: welcomeServerId,
            channelId: null,
        });

        const response: CreateProfileResponseT = {
            upload: upload,
        };

        res.json(response);
    }
}
