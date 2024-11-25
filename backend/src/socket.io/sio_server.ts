import 'dotenv/config';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { sioAuth } from '../auth/socket.io';
import { Event, EventT } from 'models';
import { API_PREFIX } from '..';
import { db } from '../db/db';
import { membershipsTable } from '../db/schema';
import { eq } from 'drizzle-orm';

const allowedOrigin = process.env.ALLOWED_ORIGIN!;
const apiVersion = parseInt(process.env.API_VERSION!);

export class SIOServer {
    private io: Server;
    private namespace = () => this.io.of(API_PREFIX);

    constructor(httpServer: http.Server) {
        this.io = new Server(httpServer, {
            path: `${API_PREFIX}/gateway`,
            cors: {
                origin: allowedOrigin,
                methods: ['GET', 'POST'],
                credentials: true
            }
        });

        this.config();
    }

    private config(): void {
        this.namespace().use(sioAuth);

        this.namespace().on('connection', async (socket: Socket) => {
            if (!socket.data.userId || !socket.data.userEmail) {
                return;
            }

            const results = await db.select({
                userId: membershipsTable.userId,
                serverId: membershipsTable.serverId
            })
            .from(membershipsTable)
            .where(eq(membershipsTable.userId, socket.data.userId))

            results.forEach((membership) => {
                socket.join(membership.serverId);
                console.log(`[gateway] ${socket.data.userEmail} registered to be notified for ${membership.serverId}`);
            });
        });
    }

    public async register(userId: string, serverId: string) {
        const allSockets = await this.namespace().fetchSockets();
        const sockets = allSockets.filter(socket => socket.data.userId === userId);

        sockets.forEach((socket) => {
            socket.join(serverId);
        })
    }

    public emitEvent(event: EventT) {
        this.namespace()
            .to(event.serverId)
            .emit('event_message', event);
    }
};