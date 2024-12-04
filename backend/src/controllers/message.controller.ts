import { eq } from 'drizzle-orm';
import { Request, Response } from 'express';
import { isLeft } from 'fp-ts/Either';
import {
    CreateMessageRequest,
    CreateMessageRequestT,
    CreateMessageResponseT,
    DeleteMessageRequest,
    DeleteMessageRequestT,
    FileT,
    S3Keys,
    UploadResponseT,
    allowedMimes,
    maxMessageLength,
} from 'models';
import { badRequest, forbidden, notFound } from '../common/response';
import { db } from '../db/db';
import { channelsTable, filesTable, messagesTable } from '../db/schema';
import { SIOServer } from '../socket.io/sio_server';
import { createUploadUrl, deleteFile } from '../util/s3';
import { verifyServer } from '../util/verify';

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
        data.files.forEach(file => {
            if (!allowedMimes.includes(file.mimeType)) {
                console.log(`disallowed mime ${file.mimeType}`);
                allowed = false;
            }
        });

        if (!allowed) {
            return badRequest(res);
        }

        const channelResult = await db
            .select({
                serverId: channelsTable.serverId,
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
        const date = new Date();

        type MessageSchema = typeof messagesTable.$inferInsert;
        const message: MessageSchema = {
            messageId: messageId,
            userId: res.locals.userId,
            channelId: data.channelId,
            serverId: serverId,
            content: data.content,
            date: date,
            hasFiles: hasFiles,
        };

        await db.insert(messagesTable).values([message]);

        type FileSchema = typeof filesTable.$inferInsert;
        const files: Array<FileSchema> = [];
        const uploads: Array<UploadResponseT> = [];

        // file array for new message notification
        const notificationFiles: Array<FileT> = [];

        for (let i = 0; i < data.files.length; i++) {
            const fileId = crypto.randomUUID();

            // data for file table in db
            files.push({
                fileId: fileId,
                messageId: messageId,
                serverId: serverId,
                name: data.files[i].name,
                mimeType: data.files[i].mimeType,
            });

            // data for http response
            const { url, fields } = await createUploadUrl(`${S3Keys.messageFiles}/${fileId}`);
            uploads.push({
                fileId: fileId,
                url: url,
                name: data.files[i].name,
                fields: fields,
            });

            // data for notification
            notificationFiles.push({
                fileId: fileId,
                messageId: messageId,
                serverId: serverId,
                userId: res.locals.userId,
                name: data.files[i].name,
                mimeType: data.files[i].mimeType,
            });
        }

        if (hasFiles) {
            await db.insert(filesTable).values(files);
        }

        this.sioServer.emitEvent({
            type: 'MESSAGE_SENT',
            clientId: data.clientId,
            userId: res.locals.userId,
            serverId: serverId,
            channelId: data.channelId,
        });

        const response: CreateMessageResponseT = {
            uploads: uploads,
        };

        res.json(response);
    }

    async deleteMessage(req: Request, res: Response) {
        if (!req.params.messageId) {
            return badRequest(res);
        }

        const decoded = DeleteMessageRequest.decode(req.body);
        if (isLeft(decoded)) {
            return badRequest(res);
        }

        const data: DeleteMessageRequestT = decoded.right;

        const result = await db
            .select({
                messageId: messagesTable.messageId,
                userId: messagesTable.userId,
                channelId: messagesTable.channelId,
                serverId: messagesTable.serverId,
                hasFiles: messagesTable.hasFiles,
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

        const fileResults = await db
            .select({
                fileId: filesTable.fileId,
                messageId: filesTable.messageId,
            })
            .from(filesTable)
            .where(eq(filesTable.messageId, messageInfo.messageId));

        fileResults.forEach(async file => {
            await deleteFile(`${S3Keys.messageFiles}/${file.fileId}`);
        });

        await db.delete(messagesTable).where(eq(messagesTable.messageId, messageInfo.messageId));

        this.sioServer.emitEvent({
            type: 'MESSAGE_DELETED',
            clientId: data.clientId,
            userId: res.locals.userId,
            serverId: messageInfo.serverId,
            channelId: messageInfo.channelId,
        });

        res.json({});
    }
}
