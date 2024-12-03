import 'dotenv/config';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { sioAuth } from '../auth/socket.io';
import { EVENT_NAME, EventT, UserStatusT, UserT } from 'models';
import { API_PREFIX } from '..';
import { db } from '../db/db';
import { membershipsTable, usersTable } from '../db/schema';
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

            console.log(`[gateway] ${socket.data.userEmail} has connected`);

            socket.on('disconnect', (reason) => {
                this.emitDisconnectEvents(socket);
                console.log(`[gateway] ${socket.data.userEmail} has disconnected: ${reason}`);
            })

            const results = await db.select({
                userId: membershipsTable.userId,
                serverId: membershipsTable.serverId
            })
            .from(membershipsTable)
            .where(eq(membershipsTable.userId, socket.data.userId))

            results.forEach((membership) => {
                socket.join(membership.serverId);
                this.emitConnectEvent(socket, membership.serverId);

                console.log(`[gateway] ${socket.data.userEmail} registered to be notified for ${membership.serverId}`);
            });
        });
    }

    private emitConnectEvent(socket: Socket, room: string) {
        const event: EventT = {
            type: 'USER_STATUS_CHANGE',
            clientId: '',
            userId: socket.data.userId,
            serverId: room,
            channelId: null
        }

        this.namespace().to(room).emit(EVENT_NAME, event);
    }

    private emitDisconnectEvents(socket: Socket) {
        socket.rooms.forEach((room) => {
            const event: EventT = {
                type: 'USER_STATUS_CHANGE',
                clientId: socket.data.clientId,
                userId: socket.data.userId,
                serverId: room,
                channelId: null
            };

            this.namespace().to(room).emit(EVENT_NAME, event);
        });
    }

    public async register(userId: string, serverId: string) {
        const allSockets = await this.namespace().fetchSockets();
        const sockets = allSockets.filter(socket => socket.data.userId === userId);

        sockets.forEach((socket) => {
            socket.join(serverId);
        })
    }

    public async emitEvent(event: EventT) {
        if (event.serverId) {
            this.namespace().to(event.serverId).emit(EVENT_NAME, event);
        } else {
            const allSockets = await this.namespace().fetchSockets();
            const sockets = allSockets.filter(socket => socket.data.userId === event.userId);

            if (sockets.length === 0) return;
            const socket = sockets[0];

            socket.rooms.forEach((room) => {
                this.namespace().to(room).emit(EVENT_NAME, event);
            });
        }
    }

    public async getUserStatuses(userIds: Set<string>): Promise<Map<string, UserStatusT>> {
        const allSockets = await this.namespace().fetchSockets();
        const sockets = allSockets.filter(socket => userIds.has(socket.data.userId));

        const statuses = new Map<string, UserStatusT>();
        userIds.forEach((userId) => {
            statuses.set(userId, 'OFFLINE');
        })

        sockets.forEach((socket) => {
            statuses.set(socket.data.userId, 'ONLINE');
        });

        return statuses;
    }
};