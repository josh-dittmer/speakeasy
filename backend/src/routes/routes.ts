import { Application, Router } from 'express';
import serverRoutes from './server.routes';

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
    }
}