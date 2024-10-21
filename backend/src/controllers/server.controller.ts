import { Request, Response } from 'express';
import { db } from '../db/db';
import { eq, and } from 'drizzle-orm';
import { membershipsTable, serversTable } from '../db/schema';
import { GetLastVisitedChannelReq, GetLastVisitedChannelReqT, LastVisitedChannelT, ServerArrayT } from 'models';
import { isLeft } from 'fp-ts/Either'

export async function getServerList(req: Request, res: Response) {
    const result: ServerArrayT = await db.select({
        serverId: membershipsTable.serverId,
        imageId: serversTable.imageId,
        name: serversTable.name
    })
    .from(membershipsTable)
    .innerJoin(serversTable, eq(membershipsTable.serverId, serversTable.serverId))
    .where(eq(membershipsTable.userId, res.locals.userId));

    res.json(result);
}

export async function getLastVisitedChannel(req: Request, res: Response) {
    const decoded = GetLastVisitedChannelReq.decode(req.body);
    if (isLeft(decoded)) {
        res.status(400).send({
            message: 'Invalid request body'
        });
        return;
    }

    const getLastVisitedChannelReq: GetLastVisitedChannelReqT = decoded.right;
    
    const result: LastVisitedChannelT[] = await db.select({
        channelId: membershipsTable.lastVisitedChannel
    })
    .from(membershipsTable)
    .where(and(
        eq(membershipsTable.userId, res.locals.userId),
        eq(membershipsTable.serverId, getLastVisitedChannelReq.serverId)
    ));

    if (!result[0]) {
        res.status(404).send({
            message: 'No data found'
        });
        return;
    }

    res.json(result[0]);
}