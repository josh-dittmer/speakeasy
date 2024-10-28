import { Request, Response } from 'express';
import { db } from '../db/db';
import { eq, asc, desc } from 'drizzle-orm';
import { channelsTable, filesTable, messagesTable } from '../db/schema';
import { ChannelArrayT, ChannelDataT, FileArrayT, MessageArrayT } from 'models';
import { isLeft } from 'fp-ts/Either'
import { badRequest, forbidden, notFound } from '../common/response';
import { formatDate } from '../util/date';
import { verifyServer } from '../util/verify';

export async function getChannelData(req: Request, res: Response) {
    const MESSAGES_PER_PAGE: number = 10;

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
            files: files
        });
    }

    const result: ChannelDataT = {
        channel: channelResult[0],
        messages: messages
    }

    res.json(result);
}