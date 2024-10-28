import { Request, Response } from 'express';
import { badRequest, forbidden, notFound } from '../common/response';
import { CreateMessageRequest, CreateMessageRequestT, CreateMessageResponseT, CreateMessageResponseUploadT } from 'models';
import { isLeft } from 'fp-ts/Either'
import { channelsTable, filesTable, messagesTable } from '../db/schema';
import { db } from '../db/db';
import { eq } from 'drizzle-orm';
import { verifyServer } from '../util/verify';
import { allowedMimes } from 'models';
import { createUploadUrl } from '../util/s3';

/*const createMessageUpload = upload.array('files');

export async function createMessage(req: Request, res: Response) {
    createMessageUpload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return badRequest(res);
        } else if (err) {
            return serverError(res);
        }

        console.log(req.file);
        console.log(req.files);
        console.log(req.body);

        return badRequest(res);
    });
}*/

export async function createMessage(req: Request, res: Response) {
    const decoded = CreateMessageRequest.decode(req.body);
    if (isLeft(decoded)) {
        return badRequest(res);
    }

    const data: CreateMessageRequestT = decoded.right;
    const hasFiles: boolean = data.files.length > 0;

    let allowed: boolean = true;
    data.files.forEach((file) => {
        if (!allowedMimes.includes(file.mimeType)) {
            console.log(`disallowed mime ${file.mimeType}`);
            allowed = false;
        }
    })

    if (!allowed) {
        return badRequest(res);
    }

    const channelResult = await db.select({
        serverId: channelsTable.serverId
    })
    .from(channelsTable)
    .where(eq(channelsTable.channelId, data.channelId));

    if (channelResult.length === 0) {
        return notFound(res, `channel ${data.channelId}`);
    }

    const serverId = channelResult[0].serverId;

    const verified = await verifyServer(res.locals.userId, serverId);
    if (!verified) {
        return forbidden(res);
    }

    const messageId = crypto.randomUUID();

    type MessageSchema = typeof messagesTable.$inferInsert;
    const message: MessageSchema = {
        messageId: messageId,
        userId: res.locals.userId,
        channelId: data.channelId,
        serverId: serverId,
        content: data.content,
        hasFiles: hasFiles
    };

    await db.insert(messagesTable).values([message]);

    if (!hasFiles) {
        res.json({});
        return;
    }

    type FileSchema = typeof filesTable.$inferInsert;
    const files: Array<FileSchema> = [];
    const uploads: Array<CreateMessageResponseUploadT> = [];

    for (let i = 0; i < data.files.length; i++) {
        const fileId = crypto.randomUUID();

        files.push({
            fileId: fileId,
            messageId: messageId,
            serverId: serverId,
            name: data.files[i].name,
            mimeType: data.files[i].mimeType
        });

        const { url, fields } = await createUploadUrl(`message_files/${fileId}`);
        uploads.push({
            fileId: fileId,
            url: url,
            name: data.files[i].name,
            fields: fields
        })
    };

    await db.insert(filesTable).values(files);

    const response: CreateMessageResponseT = {
        uploads: uploads
    };

    res.json(response);
}