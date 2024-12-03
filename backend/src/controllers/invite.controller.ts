import { Request, Response } from 'express';
import { db } from '../db/db';
import { and, eq } from 'drizzle-orm';
import { channelsTable, filesTable, membershipsTable, serversTable, usersTable } from '../db/schema';
import { allowedImageMimes, ChannelArrayT, CreateServerRequest, CreateServerRequestT, CreateServerResponseT, EditServerRequest, EditServerRequestT, EditServerResponseT, LeaveServerRequest, LeaveServerRequestT, maxServerNameLength, S3Keys, ServerArrayT, ServerDataT, UploadResponse, UploadResponseT, UserArrayT } from 'models';
import { isLeft } from 'fp-ts/Either'
import { badRequest, forbidden, notFound } from '../common/response';
import { verifyServer } from '../util/verify';
import { createUploadUrl, deleteFile } from '../util/s3';
import { SIOServer } from '../socket.io/sio_server';

export class InviteController {
    private sioServer: SIOServer;

    constructor(sioServer: SIOServer) {
        this.sioServer = sioServer;
    }

    async createInvite(req: Request, res: Response) {

    }

    async consumeInvite(req: Request, res: Response) {
        
    }

    async previewInvite(req: Request, res: Response) {
        
    }
}