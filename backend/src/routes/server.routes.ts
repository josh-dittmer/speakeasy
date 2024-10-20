import { Router } from 'express';
import { getUserServers } from '../controllers/server.controller';

class ServerRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router.get('/getUserServers', getUserServers);
    }
}

export default new ServerRoutes().router;