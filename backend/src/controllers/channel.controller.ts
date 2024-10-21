import { Request, Response } from 'express';
import { db } from '../db/db';
import { eq } from 'drizzle-orm';
import { channelsTable, serversTable } from '../db/schema';
import { ChannelArrayT, GetChannelListReq, GetChannelListReqT } from 'models';
import { isLeft } from 'fp-ts/Either'

export async function getChannelList(req: Request, res: Response) {
    const decoded = GetChannelListReq.decode(req.body);
    if (isLeft(decoded)) {
        res.status(400).send({
            message: 'Invalid request body'
        });
        return;
    }

    const getChannelListReq: GetChannelListReqT = decoded.right;
    
    const result: ChannelArrayT = await db.select({
        serverId: serversTable.serverId,
        channelId: channelsTable.channelId,
        name: channelsTable.name
    })
    .from(serversTable)
    .innerJoin(channelsTable, eq(serversTable.serverId, channelsTable.serverId))
    .where(eq(serversTable.serverId, getChannelListReq.serverId));

    if (!result[0]) {
        res.status(404).send({
            message: 'No data found'
        });
        return;
    }

    res.json(result);
}