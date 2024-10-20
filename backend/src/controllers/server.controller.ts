import { Request, Response } from 'express';
import { db } from '../db/db';
import { eq, sql } from 'drizzle-orm';
import { membershipsTable, serversTable } from '../db/schema';

export async function getUserServers(req: Request, res: Response) {
    const result = await db.select({
        serverId: membershipsTable.serverId,
        imageId: serversTable.imageId,
        name: serversTable.name
    })
    .from(membershipsTable)
    .innerJoin(serversTable, eq(membershipsTable.serverId, serversTable.serverId))
    .where(eq(membershipsTable.userId, res.locals.userId));

    res.json(result);
}