import { Router } from 'express';
import { ServerController } from '../controllers/server.controller';
import { SIOServer } from '../socket.io/sio_server';

export class ServerRoutes {
    public router: Router;
    private controller: ServerController;

    constructor(sioServer: SIOServer) {
        this.router = Router();
        this.controller = new ServerController(sioServer);
        this.init();
    }

    private init() {
        this.router.get('/getServerList', this.controller.getServerList);
        this.router.get('/getServerData/:serverId', this.controller.getServerData);
        this.router.get('/leaveServer/:serverId', this.controller.leaveServer);
        this.router.post('/editServer/:serverId', this.controller.editServer);
        this.router.post('/createServer', this.controller.createServer);
    }
}

//export default new ServerRoutes().router;