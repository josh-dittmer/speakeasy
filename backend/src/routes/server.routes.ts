import { Router } from 'express';
import { createServer, editServer, getServerData, getServerList, leaveServer } from '../controllers/server.controller';

class ServerRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router.get('/getServerList', getServerList);
        this.router.get('/getServerData/:serverId', getServerData);
        this.router.get('/leaveServer/:serverId', leaveServer);
        this.router.post('/editServer/:serverId', editServer);
        this.router.post('/createServer', createServer);
    }
}

export default new ServerRoutes().router;