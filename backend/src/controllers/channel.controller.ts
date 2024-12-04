import { desc, eq } from 'drizzle-orm';
import { Request, Response } from 'express';
import { isLeft } from 'fp-ts/Either';
import {
    ChannelArrayT,
    ChannelDataT,
    CreateChannelRequest,
    CreateChannelRequestT,
    CreateChannelResponseT,
    DeleteChannelRequest,
    DeleteChannelRequestT,
    EditChannelRequest,
    EditChannelRequestT,
    FileArrayT,
    maxChannelNameLength,
    MessageArrayT,
} from 'models';
import { badRequest, forbidden, notFound } from '../common/response';
import { db } from '../db/db';
import { channelsTable, filesTable, messagesTable } from '../db/schema';
import { SIOServer } from '../socket.io/sio_server';
import { verifyServer } from '../util/verify';

export class ChannelController {
    private sioServer: SIOServer;

    constructor(sioServer: SIOServer) {
        this.sioServer = sioServer;
    }

    async getChannelData(req: Request, res: Response) {
        const MESSAGES_PER_PAGE: number = 50;

        if (!req.params.channelId || !req.query.page) {
            return badRequest(res);
        }

        const channelId = req.params.channelId;
        const page = +req.query.page;

        const channelResult: ChannelArrayT = await db
            .select({
                channelId: channelsTable.channelId,
                serverId: channelsTable.serverId,
                name: channelsTable.name,
            })
            .from(channelsTable)
            .where(eq(channelsTable.channelId, channelId));

        if (channelResult.length === 0) {
            return notFound(res, `channel ${channelId}`);
        }

        const verified = await verifyServer(res.locals.userId, channelResult[0].serverId);
        if (!verified) {
            return forbidden(res);
        }

        const messageResult = await db
            .select({
                channelId: channelsTable.channelId,
                messageId: messagesTable.messageId,
                userId: messagesTable.userId,
                serverId: messagesTable.serverId,
                content: messagesTable.content,
                date: messagesTable.date,
                hasFiles: messagesTable.hasFiles,
            })
            .from(channelsTable)
            .innerJoin(messagesTable, eq(channelsTable.channelId, messagesTable.channelId))
            .where(eq(channelsTable.channelId, channelId))
            .orderBy(desc(messagesTable.date))
            .limit(MESSAGES_PER_PAGE)
            .offset(page * MESSAGES_PER_PAGE);

        const messages: MessageArrayT = [];
        for (let i = messageResult.length - 1; i >= 0; i--) {
            const message = messageResult[i];
            let files: FileArrayT = [];

            if (message.hasFiles) {
                const fileResult: FileArrayT = await db
                    .select({
                        fileId: filesTable.fileId,
                        messageId: filesTable.messageId,
                        serverId: filesTable.serverId,
                        userId: filesTable.userId,
                        name: filesTable.name,
                        mimeType: filesTable.mimeType,
                    })
                    .from(filesTable)
                    .where(eq(filesTable.messageId, message.messageId));

                files = fileResult;
            }

            messages.push({
                channelId: message.channelId,
                messageId: message.messageId,
                userId: message.userId,
                serverId: message.serverId,
                content: message.content,
                date: message.date.getTime(),
                isMine: message.userId === res.locals.userId,
                files: files,
            });
        }

        const result: ChannelDataT = {
            channel: channelResult[0],
            messages: messages,
        };

        res.json(result);
    }

    async deleteChannel(req: Request, res: Response) {
        if (!req.params.channelId) {
            return badRequest(res);
        }

        const decoded = DeleteChannelRequest.decode(req.body);
        if (isLeft(decoded)) {
            return badRequest(res);
        }

        const data: DeleteChannelRequestT = decoded.right;

        const result = await db
            .select({
                channelId: channelsTable.channelId,
                serverId: channelsTable.serverId,
            })
            .from(channelsTable)
            .where(eq(channelsTable.channelId, req.params.channelId));

        if (result.length === 0) {
            return notFound(res, `channel ${req.params.channelId}`);
        }

        const channelInfo = result[0];

        const verified = verifyServer(res.locals.userId, channelInfo.serverId);
        if (!verified) {
            return forbidden(res);
        }

        await db.delete(channelsTable).where(eq(channelsTable.channelId, channelInfo.channelId));

        this.sioServer.emitEvent({
            type: 'CHANNEL_DELETED',
            clientId: data.clientId,
            userId: res.locals.userId,
            serverId: channelInfo.serverId,
            channelId: channelInfo.channelId,
        });

        res.json({});
    }

    async editChannel(req: Request, res: Response) {
        if (!req.params.channelId) {
            return badRequest(res);
        }

        const decoded = EditChannelRequest.decode(req.body);
        if (isLeft(decoded)) {
            return badRequest(res);
        }

        const data: EditChannelRequestT = decoded.right;

        if (data.name.length > maxChannelNameLength) {
            return badRequest(res);
        }

        const result = await db
            .select({
                channelId: channelsTable.channelId,
                serverId: channelsTable.serverId,
            })
            .from(channelsTable)
            .where(eq(channelsTable.channelId, req.params.channelId));

        if (result.length === 0) {
            return notFound(res, `channel ${req.params.channelId}`);
        }

        const channelInfo = result[0];

        const verified = verifyServer(res.locals.userId, channelInfo.serverId);
        if (!verified) {
            return forbidden(res);
        }

        await db
            .update(channelsTable)
            .set({ name: data.name })
            .where(eq(channelsTable.channelId, channelInfo.channelId));

        this.sioServer.emitEvent({
            type: 'CHANNEL_EDITED',
            clientId: data.clientId,
            userId: res.locals.userId,
            serverId: channelInfo.serverId,
            channelId: channelInfo.channelId,
        });

        res.json({});
    }

    async createChannel(req: Request, res: Response) {
        const decoded = CreateChannelRequest.decode(req.body);
        if (isLeft(decoded)) {
            return badRequest(res);
        }

        const data: CreateChannelRequestT = decoded.right;

        if (data.name.length > maxChannelNameLength) {
            return badRequest(res);
        }

        const verified = await verifyServer(res.locals.userId, data.serverId);
        if (!verified) {
            return forbidden(res);
        }

        const channelId = crypto.randomUUID();

        type ChannelSchema = typeof channelsTable.$inferInsert;
        const channel: ChannelSchema = {
            channelId: channelId,
            serverId: data.serverId,
            name: data.name,
        };

        await db.insert(channelsTable).values([channel]);

        const response: CreateChannelResponseT = {
            serverId: data.serverId,
            channelId: channelId,
        };

        this.sioServer.emitEvent({
            type: 'CHANNEL_CREATED',
            clientId: data.clientId,
            userId: res.locals.userId,
            serverId: data.serverId,
            channelId: channelId,
        });

        res.json(response);
    }
}
