import { Request, Response } from 'express';
import { db } from '../db/db';
import { UserArrayT } from 'models';
import { usersTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from '../common/response';

export async function getMyUserData(req: Request, res: Response) {
    const result: UserArrayT = await db.select({
        userId: usersTable.userId,
        imageId: usersTable.imageId,
        name: usersTable.name,
        bio: usersTable.bio
    })
    .from(usersTable)
    .where(eq(usersTable.userId, res.locals.userId))

    if (result.length === 0) {
        return notFound(res, `user ${res.locals.userId}`);
    }

    res.json(result[0]);
}