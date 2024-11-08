import { Application, Router } from 'express';
import serverRoutes from './server.routes';
import userRoutes from './user.routes';
import channelRoutes from './channel.routes';
import messageRoutes from './message.routes';
import fileRoutes from './file.routes';

const apiVersion = parseInt(process.env.API_VERSION!);

export default class Routes {
    public router: Router;

    constructor(app: Application) {
        this.router = Router();
        this.init();

        app.use(`/api/v${apiVersion}`, this.router);
    }

    private init() {
        this.router.use(serverRoutes);
        this.router.use(userRoutes);
        this.router.use(channelRoutes);
        this.router.use(messageRoutes);
        this.router.use(fileRoutes);
    }
}