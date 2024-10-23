import { Router } from 'express';
import { getServerData, getServerList } from '../controllers/server.controller';

class ServerRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router.get('/getServerList', getServerList);
        this.router.get('/getServerData/:serverId', getServerData);
    }
}

export default new ServerRoutes().router;