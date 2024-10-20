import 'dotenv/config';

import express, { Application } from 'express';
import cors, { CorsOptions } from 'cors';

import { auth } from './auth';

import Routes from './routes/routes'

const apiAddress = process.env.API_ADDRESS!;
const apiPort = process.env.API_PORT!;

export default class Server {
    private routes: Routes;

    constructor(app: Application) {
        this.config(app);
        this.routes = new Routes(app);
    }

    private config(app: Application): void {
        const corsOptions: CorsOptions = {
            origin: `${apiAddress}:${apiPort}`
        };

        app.use(cors(corsOptions));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(auth);
    }
}

const app: Application = express();
const server: Server = new Server(app);

app.listen(apiPort, () => {
    console.log(`Server listening on ${apiPort}`);
})

app.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
        console.log('Error: Port is in use! Is the server already running?');
    } else {
        console.log(`Error: ${err}`);
    }
})