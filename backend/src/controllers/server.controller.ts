import { Request, Response } from 'express';
import { db } from '../db/db';
import { eq } from 'drizzle-orm';
import { channelsTable, membershipsTable, serversTable, usersTable } from '../db/schema';
import { ChannelArrayT, ServerArrayT, ServerDataT, UserArrayT } from 'models';
import { isLeft } from 'fp-ts/Either'
import { badRequest, forbidden, notFound } from '../common/response';
import { verifyServer } from '../util/verify';

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

export async function getServerData(req: Request, res: Response) {
    if (!req.params.serverId) {
        return badRequest(res);
    }

    const serverId = req.params.serverId;

    const serverResult: ServerArrayT = await db.select({
        serverId: serversTable.serverId,
        imageId: serversTable.imageId,
        name: serversTable.name
    })
    .from(serversTable)
    .where(eq(serversTable.serverId, serverId))

    if (serverResult.length === 0) {
        return notFound(res, `server ${serverId}`);
    }

    const verified = verifyServer(res.locals.userId, serverId);
    if (!verified) {
        return forbidden(res);
    }

    const channelResult: ChannelArrayT = await db.select({
        serverId: serversTable.serverId,
        channelId: channelsTable.channelId,
        name: channelsTable.name
    })
    .from(serversTable)
    .innerJoin(channelsTable, eq(serversTable.serverId, channelsTable.serverId))
    .where(eq(serversTable.serverId, serverId));

    const userResult: UserArrayT = await db.select({
        userId: membershipsTable.userId,
        imageId: usersTable.imageId,
        name: usersTable.name,
        bio: usersTable.bio
    })
    .from(membershipsTable)
    .innerJoin(usersTable, eq(membershipsTable.userId, usersTable.userId))
    .where(eq(membershipsTable.serverId, serverResult[0].serverId));

    const result: ServerDataT = {
        server: serverResult[0],
        channels: channelResult,
        users: userResult
    };

    //await new Promise((res) => setTimeout(res, 2000));

    res.json(result);
}