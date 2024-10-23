import { Request, Response } from 'express';
import { db } from '../db/db';
import { eq, asc, desc } from 'drizzle-orm';
import { channelsTable, messagesTable } from '../db/schema';
import { ChannelArrayT, ChannelDataT, MessageArrayT } from 'models';
import { isLeft } from 'fp-ts/Either'
import { badRequest, notFound } from '../common/response';
import { formatDate } from '../util/date';

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

    const messageResult = await db.select({
        channelId: channelsTable.channelId,
        messageId: messagesTable.messageId,
        userId: messagesTable.userId,
        serverId: messagesTable.serverId,
        content: messagesTable.content,
        date: messagesTable.date,
    })
    .from(channelsTable)
    .innerJoin(messagesTable, eq(channelsTable.channelId, messagesTable.channelId))
    .where(eq(channelsTable.channelId, channelId))
    .orderBy(desc(messagesTable.date))
    .limit(MESSAGES_PER_PAGE)
    .offset(page * MESSAGES_PER_PAGE)

    const messages: MessageArrayT = [];
    messageResult.map((message) => {
        messages.push({
            channelId: message.channelId,
            messageId: message.messageId,
            userId: message.userId,
            serverId: message.serverId,
            content: message.content,
            date: formatDate(message.date)
        });
    })

    const result: ChannelDataT = {
        channel: channelResult[0],
        messages: messages
    }

    res.json(result);
}