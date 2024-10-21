import { Router } from 'express';
import { getLastVisitedChannel, getServerList } from '../controllers/server.controller';

class ServerRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router.get('/getServerList', getServerList);
        this.router.post('/getLastVisitedChannel', getLastVisitedChannel);
    }
}

export default new ServerRoutes().router;