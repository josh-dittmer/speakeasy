import { and, eq } from 'drizzle-orm';
import { Request, Response } from 'express';
import { isLeft } from 'fp-ts/Either';
import {
    allowedImageMimes,
    ChannelArrayT,
    CreateServerRequest,
    CreateServerRequestT,
    CreateServerResponseT,
    EditServerRequest,
    EditServerRequestT,
    EditServerResponseT,
    LeaveServerRequest,
    LeaveServerRequestT,
    maxServerNameLength,
    S3Keys,
    ServerArrayT,
    ServerDataT,
    UploadResponseT,
    UserArrayT,
} from 'models';
import { badRequest, forbidden, notFound } from '../common/response';
import { db } from '../db/db';
import {
    channelsTable,
    filesTable,
    membershipsTable,
    serversTable,
    usersTable,
} from '../db/schema';
import { SIOServer } from '../socket.io/sio_server';
import { createUploadUrl, deleteFile } from '../util/s3';
import { verifyServer } from '../util/verify';

export class ServerController {
    private sioServer: SIOServer;

    constructor(sioServer: SIOServer) {
        this.sioServer = sioServer;
    }

    async getServerList(req: Request, res: Response) {
        const result: ServerArrayT = await db
            .select({
                serverId: membershipsTable.serverId,
                imageId: serversTable.imageId,
                name: serversTable.name,
            })
            .from(membershipsTable)
            .innerJoin(serversTable, eq(membershipsTable.serverId, serversTable.serverId))
            .where(eq(membershipsTable.userId, res.locals.userId));

        res.json(result);
    }

    async getServerData(req: Request, res: Response) {
        if (!req.params.serverId) {
            return badRequest(res);
        }

        const serverId = req.params.serverId;

        const serverResult: ServerArrayT = await db
            .select({
                serverId: serversTable.serverId,
                imageId: serversTable.imageId,
                name: serversTable.name,
            })
            .from(serversTable)
            .where(eq(serversTable.serverId, serverId));

        if (serverResult.length === 0) {
            return notFound(res, `server ${serverId}`);
        }

        const verified = verifyServer(res.locals.userId, serverId);
        if (!verified) {
            return forbidden(res);
        }

        const channelResult: ChannelArrayT = await db
            .select({
                serverId: serversTable.serverId,
                channelId: channelsTable.channelId,
                name: channelsTable.name,
            })
            .from(serversTable)
            .innerJoin(channelsTable, eq(serversTable.serverId, channelsTable.serverId))
            .where(eq(serversTable.serverId, serverId));

        const userResult = await db
            .select({
                userId: membershipsTable.userId,
                imageId: usersTable.imageId,
                name: usersTable.name,
                bio: usersTable.bio,
            })
            .from(membershipsTable)
            .innerJoin(usersTable, eq(membershipsTable.userId, usersTable.userId))
            .where(eq(membershipsTable.serverId, serverResult[0].serverId));

        const userMap = new Map<string, typeof usersTable.$inferSelect>();
        userResult.forEach(result => {
            userMap.set(result.userId, result);
        });

        const userIds = new Set<string>();
        userResult.forEach(result => {
            userIds.add(result.userId);
        });

        const users: UserArrayT = [];
        const statuses = await this.sioServer.getUserStatuses(userIds);

        statuses.forEach((status, userId) => {
            const user = userMap.get(userId);
            if (!user) return;

            users.push({
                userId: userId,
                imageId: user.imageId,
                name: user.name,
                bio: user.bio,
                status: status,
            });
        });

        const result: ServerDataT = {
            server: serverResult[0],
            channels: channelResult,
            users: users,
        };

        //await new Promise((res) => setTimeout(res, 2000));

        res.json(result);
    }

    async createServer(req: Request, res: Response) {
        const decoded = CreateServerRequest.decode(req.body);
        if (isLeft(decoded)) {
            return badRequest(res);
        }

        const data: CreateServerRequestT = decoded.right;

        if (data.name.length > maxServerNameLength) {
            return badRequest(res);
        }

        const serverId = crypto.randomUUID();

        let upload: UploadResponseT | undefined;
        const imageId: string = crypto.randomUUID();

        await db.insert(serversTable).values([
            {
                serverId: serverId,
                imageId: data.image ? imageId : null,
                name: data.name,
            },
        ]);

        await db.insert(membershipsTable).values([
            {
                userId: res.locals.userId,
                serverId: serverId,
            },
        ]);

        if (data.image) {
            if (!allowedImageMimes.includes(data.image.mimeType)) {
                return badRequest(res);
            }

            await db.insert(filesTable).values([
                {
                    fileId: imageId,
                    serverId: serverId,
                    name: data.image.name,
                    mimeType: data.image.mimeType,
                },
            ]);

            const { url, fields } = await createUploadUrl(`${S3Keys.serverImgs}/${imageId}`);
            upload = {
                fileId: imageId,
                url: url,
                name: data.image.name,
                fields: fields,
            };
        }

        this.sioServer.register(res.locals.userId, serverId);

        const response: CreateServerResponseT = {
            upload: upload,
        };

        res.json(response);
    }

    async editServer(req: Request, res: Response) {
        if (!req.params.serverId) {
            return badRequest(res);
        }

        const decoded = EditServerRequest.decode(req.body);
        if (isLeft(decoded)) {
            return badRequest(res);
        }

        const data: EditServerRequestT = decoded.right;

        if (data.name.length > maxServerNameLength) {
            return badRequest(res);
        }

        const serverResult = await db
            .select({
                serverId: serversTable.serverId,
                imageId: serversTable.imageId,
            })
            .from(serversTable)
            .where(eq(serversTable.serverId, req.params.serverId));

        if (serverResult.length === 0) {
            return notFound(res, `server ${req.params.serverId}`);
        }

        const serverInfo = serverResult[0];

        const verified = await verifyServer(res.locals.userId, serverInfo.serverId);
        if (!verified) {
            return forbidden(res);
        }

        let upload: UploadResponseT | undefined;
        let imageId: string | null = serverInfo.imageId;

        if (data.image) {
            if (!allowedImageMimes.includes(data.image.mimeType)) {
                return badRequest(res);
            }

            if (imageId) {
                await deleteFile(`${S3Keys.serverImgs}/${imageId}`);
                await db.delete(filesTable).where(eq(filesTable.fileId, imageId));
            }

            imageId = crypto.randomUUID();

            await db.insert(filesTable).values([
                {
                    fileId: imageId,
                    serverId: serverInfo.serverId,
                    name: data.image.name,
                    mimeType: data.image.mimeType,
                },
            ]);

            const { url, fields } = await createUploadUrl(`${S3Keys.serverImgs}/${imageId}`);
            upload = {
                fileId: imageId,
                url: url,
                name: data.image.name,
                fields: fields,
            };
        }

        await db
            .update(serversTable)
            .set({
                name: data.name,
                imageId: imageId,
            })
            .where(eq(serversTable.serverId, serverInfo.serverId));

        this.sioServer.emitEvent({
            type: 'SERVER_EDITED',
            clientId: data.clientId,
            userId: res.locals.userId,
            serverId: serverInfo.serverId,
            channelId: null,
        });

        const response: EditServerResponseT = {
            upload: upload,
        };

        res.json(response);
    }

    async leaveServer(req: Request, res: Response) {
        if (!req.params.serverId) {
            return badRequest(res);
        }

        const decoded = LeaveServerRequest.decode(req.body);
        if (isLeft(decoded)) {
            return badRequest(res);
        }

        const data: LeaveServerRequestT = decoded.right;

        const serverId = req.params.serverId;

        await db
            .delete(membershipsTable)
            .where(
                and(
                    eq(membershipsTable.userId, res.locals.userId),
                    eq(membershipsTable.serverId, serverId),
                ),
            );

        this.sioServer.emitEvent({
            type: 'SERVER_USER_LEAVE',
            clientId: data.clientId,
            userId: res.locals.userId,
            serverId: serverId,
            channelId: null,
        });

        res.json({});
    }
}
