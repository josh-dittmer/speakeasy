import { Application, Router } from 'express';
import { SIOServer } from '../socket.io/sio_server';
import { ChannelRoutes } from './channel.routes';
import { FileRoutes } from './file.routes';
import { MessageRoutes } from './message.routes';
import { ServerRoutes } from './server.routes';
import { UserRoutes } from './user.routes';

const apiVersion = parseInt(process.env.API_VERSION!);

export default class Routes {
    public router: Router;

    private channelRoutes: ChannelRoutes;
    private fileRoutes: FileRoutes;
    private messageRoutes: MessageRoutes;
    private serverRoutes: ServerRoutes;
    private userRoutes: UserRoutes;

    constructor(app: Application, sioServer: SIOServer) {
        this.router = Router();

        this.channelRoutes = new ChannelRoutes(sioServer);
        this.fileRoutes = new FileRoutes(sioServer);
        this.messageRoutes = new MessageRoutes(sioServer);
        this.serverRoutes = new ServerRoutes(sioServer);
        this.userRoutes = new UserRoutes(sioServer);

        this.init();

        app.use(`/api/v${apiVersion}`, this.router);
    }

    private init() {
        this.router.use(this.channelRoutes.router);
        this.router.use(this.fileRoutes.router);
        this.router.use(this.messageRoutes.router);
        this.router.use(this.serverRoutes.router);
        this.router.use(this.userRoutes.router);
    }
}