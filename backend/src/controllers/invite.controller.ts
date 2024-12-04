import { and, eq } from 'drizzle-orm';
import { Request, Response } from 'express';
import { isLeft } from 'fp-ts/Either';
import {
    ConsumeInviteResponseT,
    CreateInviteRequest,
    CreateInviteRequestT,
    CreateInviteResponseT,
    PreviewInviteResponseT,
} from 'models';
import { badRequest, forbidden, notFound } from '../common/response';
import { db } from '../db/db';
import { invitesTable, membershipsTable, serversTable, usersTable } from '../db/schema';
import { SIOServer } from '../socket.io/sio_server';
import { verifyServer } from '../util/verify';

export class InviteController {
    private sioServer: SIOServer;

    constructor(sioServer: SIOServer) {
        this.sioServer = sioServer;
    }

    async createInvite(req: Request, res: Response) {
        const decoded = CreateInviteRequest.decode(req.body);
        if (isLeft(decoded)) {
            return badRequest(res);
        }

        const data: CreateInviteRequestT = decoded.right;

        if (data.validFor && data.validFor < 0) {
            return badRequest(res);
        }

        const verified = await verifyServer(res.locals.userId, data.serverId);
        if (!verified) {
            return forbidden(res);
        }

        const inviteId = crypto.randomUUID();

        type InviteSchema = typeof invitesTable.$inferInsert;
        const invite: InviteSchema = {
            inviteId: inviteId,
            serverId: data.serverId,
            userId: res.locals.userId,
            expiresAt: data.validFor ? new Date(Date.now() + data.validFor) : null,
        };

        await db.insert(invitesTable).values([invite]);

        const response: CreateInviteResponseT = {
            inviteId: inviteId,
        };

        res.json(response);
    }

    async consumeInvite(req: Request, res: Response) {
        if (!req.params.inviteId) {
            return badRequest(res);
        }

        const inviteId = req.params.inviteId;

        const inviteResult = await db
            .select({
                inviteId: invitesTable.inviteId,
                serverId: invitesTable.serverId,
                expiresAt: invitesTable.expiresAt,
            })
            .from(invitesTable)
            .where(eq(invitesTable.inviteId, inviteId));

        if (inviteResult.length === 0) {
            return notFound(res, `invite ${inviteId}`);
        }

        const invite = inviteResult[0];

        const membershipResult = await db
            .select({
                serverId: membershipsTable.serverId,
                userId: membershipsTable.userId,
            })
            .from(membershipsTable)
            .where(
                and(
                    eq(membershipsTable.userId, res.locals.userId),
                    eq(membershipsTable.serverId, invite.serverId),
                ),
            );

        const joined = membershipResult.length !== 0;

        if ((invite.expiresAt && Date.now() >= invite.expiresAt.getTime()) || joined) {
            const response: ConsumeInviteResponseT = {
                success: false,
                serverId: invite.serverId,
                expiresAt: invite.expiresAt ? invite.expiresAt.getTime() : null,
                joined: joined,
            };

            res.json(response);
            return;
        }

        await db.insert(membershipsTable).values([
            {
                userId: res.locals.userId,
                serverId: invite.serverId,
            },
        ]);

        const response: ConsumeInviteResponseT = {
            success: true,
            serverId: invite.serverId,
            expiresAt: invite.expiresAt ? invite.expiresAt.getTime() : null,
            joined: false,
        };

        res.json(response);
    }

    async previewInvite(req: Request, res: Response) {
        if (!req.params.inviteId) {
            return badRequest(res);
        }

        const inviteId = req.params.inviteId;

        const inviteResult = await db
            .select({
                inviteId: invitesTable.inviteId,
                serverId: invitesTable.serverId,
                expiresAt: invitesTable.expiresAt,
                serverName: serversTable.name,
                serverImageId: serversTable.imageId,
                userName: usersTable.name,
            })
            .from(invitesTable)
            .innerJoin(serversTable, eq(serversTable.serverId, invitesTable.serverId))
            .innerJoin(usersTable, eq(usersTable.userId, invitesTable.userId))
            .where(eq(invitesTable.inviteId, inviteId));

        if (inviteResult.length === 0) {
            return notFound(res, `invite ${inviteId}`);
        }

        const invite = inviteResult[0];

        const membershipResult = await db
            .select({
                serverId: membershipsTable.serverId,
                userId: membershipsTable.userId,
            })
            .from(membershipsTable)
            .where(
                and(
                    eq(membershipsTable.userId, res.locals.userId),
                    eq(membershipsTable.serverId, invite.serverId),
                ),
            );

        const joined = membershipResult.length !== 0;

        const response: PreviewInviteResponseT = {
            serverId: invite.serverId,
            serverName: invite.serverName,
            serverImageId: invite.serverImageId,
            userName: invite.userName,
            expiresAt: invite.expiresAt ? invite.expiresAt.getTime() : null,
            joined: joined,
        };

        res.json(response);
    }
}
