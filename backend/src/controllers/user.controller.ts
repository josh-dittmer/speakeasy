import { Request, Response } from 'express';
import { db } from '../db/db';
import { eq } from 'drizzle-orm';
import { usersTable } from '../db/schema';
import { LastVisitedServerT } from 'models';

export async function getLastVisitedServer(req: Request, res: Response) {
    const result: LastVisitedServerT[] = await db.select({
        serverId: usersTable.lastVisitedServer
    })
    .from(usersTable)
    .where(eq(usersTable.userId, res.locals.userId));

    res.json(result[0]);
}