import { Request, Response } from 'express';
import { badRequest, forbidden, notFound, serverError } from '../common/response';
import { db } from '../db/db';
import { filesTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { FileArrayT, S3Keys } from 'models';
import { verifyServer } from '../util/verify';
import { createDownloadUrl, fileExists, streamDownload } from '../util/s3';

export async function getFile(req: Request, res: Response) {
    if (!req.params.type || !req.params.fileId) {
        return badRequest(res);
    }

    let key = '';
    switch (req.params.type) {
        case 'messageFiles':
            key = S3Keys.messageFiles;
            break;
        case 'profileImgs':
            key = S3Keys.profileImgs;
            break;
        case 'serverImgs':
            key = S3Keys.serverImgs;
            break;
        default:
            return badRequest(res);
    }

    const results: FileArrayT = await db.select({
        fileId: filesTable.fileId,
        messageId: filesTable.messageId,
        serverId: filesTable.serverId,
        userId: filesTable.userId,
        name: filesTable.name,
        mimeType: filesTable.mimeType
    })
    .from(filesTable)
    .where(eq(filesTable.fileId, req.params.fileId))

    if (results.length === 0) {
        return notFound(res, `file ${req.params.fileId}`);
    }

    const file = results[0];

    if (file.serverId) {
        const verified = await verifyServer(res.locals.userId, file.serverId);
        if (!verified) {
            return forbidden(res);
        }
    }

    const exists = await fileExists(`${key}/${file.fileId}`);
    if (!exists) {
        return notFound(res, `file ${req.params.fileId}`);
    }

    else {
        return await streamDownload(res, `${key}/${file.fileId}`, file.mimeType);
    }
}