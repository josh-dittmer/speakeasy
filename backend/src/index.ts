import 'dotenv/config';

import cors, { CorsOptions } from 'cors';
import express, { Application } from 'express';
import http from 'http';

import { expressAuth } from './auth/express';
import Routes from './routes/routes';
import { SIOServer } from './socket.io/sio_server';
import { asyncHandler } from './util/async_error_handler';

const apiPort = process.env.API_PORT!;
const apiVersion = process.env.API_VERSION!;
const allowedOrigin = process.env.ALLOWED_ORIGIN!;

export const API_PREFIX = `/api/v${apiVersion}`;

export default class SpeakeasyServer {
    private sioServer: SIOServer;
    private routes: Routes;

    constructor(app: Application, httpServer: http.Server) {
        this.config(app);

        this.sioServer = new SIOServer(httpServer);
        this.routes = new Routes(app, this.sioServer);
    }

    private config(app: Application): void {
        const corsOptions: CorsOptions = {
            origin: allowedOrigin,
        };

        app.disable('x-powered-by');

        app.use(cors(corsOptions));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(asyncHandler(expressAuth));
    }
}

const app: Application = express();
const httpServer: http.Server = http.createServer(app);

new SpeakeasyServer(app, httpServer);

httpServer.listen(apiPort, () => {
    console.log(`Server listening on ${apiPort}`);
});

app.on('error', err => {
    console.log(`Error: ${err}`);
});
