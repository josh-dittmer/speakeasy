import { Request, Response } from 'express';
import { db } from '../db/db';
import { eq, asc, desc } from 'drizzle-orm';
import { channelsTable, filesTable, messagesTable } from '../db/schema';
import { ChannelArrayT, ChannelDataT, CreateChannelRequest, CreateChannelRequestT, CreateChannelResponseT, EditChannelRequest, EditChannelRequestT, FileArrayT, maxChannelNameLength, MessageArrayT } from 'models';
import { isLeft } from 'fp-ts/Either'
import { badRequest, forbidden, notFound } from '../common/response';
import { formatDate } from '../util/date';
import { verifyServer } from '../util/verify';

export async function getChannelData(req: Request, res: Response) {
    const MESSAGES_PER_PAGE: number = 50;

    if (!req.params.channelId || !req.query.page) {
        return badRequest(res);
    }

    const channelId = req.params.channelId;
    const page = +req.query.page;

    const channelResult: ChannelArrayT = await db.select({
        channelId: channelsTable.channelId,
        serverId: channelsTable.serverId,
        name: channelsTable.name
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

    const messageResult = await db.select({
        channelId: channelsTable.channelId,
        messageId: messagesTable.messageId,
        userId: messagesTable.userId,
        serverId: messagesTable.serverId,
        content: messagesTable.content,
        date: messagesTable.date,
        hasFiles: messagesTable.hasFiles
    })
    .from(channelsTable)
    .innerJoin(messagesTable, eq(channelsTable.channelId, messagesTable.channelId))
    .where(eq(channelsTable.channelId, channelId))
    .orderBy(desc(messagesTable.date))
    .limit(MESSAGES_PER_PAGE)
    .offset(page * MESSAGES_PER_PAGE)

    const messages: MessageArrayT = [];
    for (let i = messageResult.length - 1; i >= 0; i--) {
        const message = messageResult[i];
        let files: FileArrayT = [];
        
        if (message.hasFiles) {
            const fileResult: FileArrayT = await db.select({
                fileId: filesTable.fileId,
                messageId: filesTable.messageId,
                serverId: filesTable.serverId,
                userId: filesTable.userId,
                name: filesTable.name,
                mimeType: filesTable.mimeType
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
            date: formatDate(message.date),
            isMine: message.userId === res.locals.userId,
            files: files
        });
    }

    const result: ChannelDataT = {
        channel: channelResult[0],
        messages: messages
    }

    res.json(result);
}

export async function deleteChannel(req: Request, res: Response) {
    if (!req.params.channelId) {
        return badRequest(res);
    }

    const result = await db.select({
        channelId: channelsTable.channelId,
        serverId: channelsTable.serverId
    })
    .from(channelsTable)
    .where((eq(channelsTable.channelId, req.params.channelId)));

    if (result.length === 0) {
        return notFound(res, `channel ${req.params.channelId}`);
    }

    const channelInfo = result[0];

    const verified = verifyServer(res.locals.userId, channelInfo.serverId);
    if (!verified) {
        return forbidden(res);
    }

    await db.delete(channelsTable).where(eq(channelsTable.channelId, channelInfo.channelId));

    res.json({});
}

export async function editChannel(req: Request, res: Response) {
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

    const result = await db.select({
        channelId: channelsTable.channelId,
        serverId: channelsTable.serverId
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

    await db.update(channelsTable)
        .set({ name: data.name })
        .where(eq(channelsTable.channelId, channelInfo.channelId));

    res.json({});
}

export async function createChannel(req: Request, res: Response) {
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
        name: data.name
    };

    await db.insert(channelsTable).values([channel]);

    const response: CreateChannelResponseT = {
        serverId: data.serverId,
        channelId: channelId
    }

    res.json(response);
}