import { eq, and } from "drizzle-orm";
import { db } from "../db/db";
import { membershipsTable } from "../db/schema";

export async function verifyServer(userId: string, serverId: string): Promise<boolean> {
    const result = await db.select({
        userId: membershipsTable.userId,
        serverId: membershipsTable.serverId
    })
    .from(membershipsTable)
    .where(and(eq(membershipsTable.userId, userId), eq(membershipsTable.serverId, serverId)))

    if (result.length === 0) {
        return false;
    }

    return true;
}