import { Application, Router } from 'express';
import { API_PREFIX } from '..';
import { SIOServer } from '../socket.io/sio_server';
import { ChannelRoutes } from './channel.routes';
import { FileRoutes } from './file.routes';
import { InviteRoutes } from './invite.routes';
import { MessageRoutes } from './message.routes';
import { ServerRoutes } from './server.routes';
import { UserRoutes } from './user.routes';

//const apiVersion = parseInt(process.env.API_VERSION!);

export default class Routes {
    public router: Router;

    private channelRoutes: ChannelRoutes;
    private fileRoutes: FileRoutes;
    private messageRoutes: MessageRoutes;
    private serverRoutes: ServerRoutes;
    private userRoutes: UserRoutes;
    private inviteRoutes: InviteRoutes;

    constructor(app: Application, sioServer: SIOServer) {
        this.router = Router();

        this.channelRoutes = new ChannelRoutes(sioServer);
        this.fileRoutes = new FileRoutes(sioServer);
        this.messageRoutes = new MessageRoutes(sioServer);
        this.serverRoutes = new ServerRoutes(sioServer);
        this.userRoutes = new UserRoutes(sioServer);
        this.inviteRoutes = new InviteRoutes(sioServer);

        this.init();

        app.use(`${API_PREFIX}`, this.router);
    }

    private init() {
        this.router.use(this.channelRoutes.router);
        this.router.use(this.fileRoutes.router);
        this.router.use(this.messageRoutes.router);
        this.router.use(this.serverRoutes.router);
        this.router.use(this.userRoutes.router);
        this.router.use(this.inviteRoutes.router);
    }
}
