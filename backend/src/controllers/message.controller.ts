import { Request, Response } from 'express';
import { badRequest, forbidden, notFound } from '../common/response';
import { CreateMessageRequest, CreateMessageRequestT, CreateMessageResponseT, UploadResponseT, S3Keys, maxMessageLength } from 'models';
import { isLeft } from 'fp-ts/Either'
import { channelsTable, filesTable, messagesTable } from '../db/schema';
import { db } from '../db/db';
import { eq } from 'drizzle-orm';
import { verifyServer } from '../util/verify';
import { allowedMimes } from 'models';
import { createUploadUrl, deleteFile } from '../util/s3';
import { SIOServer } from '../socket.io/sio_server';

export class MessageController {
    private sioServer: SIOServer;

    constructor(sioServer: SIOServer) {
        this.sioServer = sioServer;
    }

    async createMessage(req: Request, res: Response) {
        const decoded = CreateMessageRequest.decode(req.body);
        if (isLeft(decoded)) {
            return badRequest(res);
        }

        const data: CreateMessageRequestT = decoded.right;
        const hasFiles: boolean = data.files.length > 0;

        if (data.content.length > maxMessageLength) {
            return badRequest(res);
        }

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
        const uploads: Array<UploadResponseT> = [];

        for (let i = 0; i < data.files.length; i++) {
            const fileId = crypto.randomUUID();

            files.push({
                fileId: fileId,
                messageId: messageId,
                serverId: serverId,
                name: data.files[i].name,
                mimeType: data.files[i].mimeType
            });

            const { url, fields } = await createUploadUrl(`${S3Keys.messageFiles}/${fileId}`);
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

    async deleteMessage(req: Request, res: Response) {
        if (!req.params.messageId) {
            return badRequest(res);
        }

        const result = await db.select({
            messageId: messagesTable.messageId,
            userId: messagesTable.userId,
            channelId: messagesTable.channelId,
            hasFiles: messagesTable.hasFiles
        })
        .from(messagesTable)
        .where(eq(messagesTable.messageId, req.params.messageId));

        if (result.length === 0) {
            return notFound(res, `message ${req.params.messageId}`);
        }

        const messageInfo = result[0];

        if (messageInfo.userId !== res.locals.userId) {
            return forbidden(res);
        }

        const fileResults = await db.select({
            fileId: filesTable.fileId,
            messageId: filesTable.messageId
        })
        .from(filesTable)
        .where(eq(filesTable.messageId, messageInfo.messageId));

        fileResults.forEach(async (file) => {
            await deleteFile(`${S3Keys.messageFiles}/${file.fileId}`)
        });

        await db.delete(messagesTable).where(eq(messagesTable.messageId, messageInfo.messageId));

        res.json({});
    }
}