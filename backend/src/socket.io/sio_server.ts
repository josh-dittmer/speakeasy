import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';

const allowedOrigin = process.env.ALLOWED_ORIGIN!;
const apiVersion = parseInt(process.env.API_VERSION!);

export class SIOServer {
    private io: Server;

    constructor(httpServer: http.Server) {
        this.io = new Server(httpServer, {
            path: `/api/v${apiVersion}/gateway`,
            cors: {
                origin: allowedOrigin,
                methods: ['GET', 'POST'],
                credentials: true
            }
        });

        this.config();
    }

    private config(): void {
        this.io.of(`/api/v${apiVersion}`).on('connection', (socket) => {
            console.log('a guy has connected');
        });
    }
};