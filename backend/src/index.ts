import 'dotenv/config';

import express, { Application, Request, Response, NextFunction } from 'express';
import http from 'http';
import cors, { CorsOptions } from 'cors';

import { auth } from './auth';

import Routes from './routes/routes'
import { SIOServer } from './socket.io/sio_server';
import { Server } from 'socket.io';

const apiPort = process.env.API_PORT!;
const allowedOrigin = process.env.ALLOWED_ORIGIN!;

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
            origin: allowedOrigin
        };

        app.disable('x-powered-by');

        app.use(cors(corsOptions));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(auth);
    }
}

const app: Application = express();
const httpServer: http.Server = http.createServer(app);

const server: SpeakeasyServer = new SpeakeasyServer(app, httpServer);

httpServer.listen(apiPort, () => {
    console.log(`Server listening on ${apiPort}`);
})

app.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
        console.log('Error: Port is in use! Is the server already running?');
    } else {
        console.log(`Error: ${err}`);
    }
})