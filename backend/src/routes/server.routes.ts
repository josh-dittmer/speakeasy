import { Router } from 'express';
import { ServerController } from '../controllers/server.controller';
import { SIOServer } from '../socket.io/sio_server';
import { asyncHandler } from '../util/async_error_handler';

export class ServerRoutes {
    public router: Router;
    private controller: ServerController;

    constructor(sioServer: SIOServer) {
        this.router = Router();
        this.controller = new ServerController(sioServer);
        this.init();
    }

    private init() {
        this.router.get(
            '/getServerList',
            asyncHandler((req, res) => this.controller.getServerList(req, res)),
        );
        this.router.get(
            '/getServerData/:serverId',
            asyncHandler((req, res) => this.controller.getServerData(req, res)),
        );
        this.router.post(
            '/leaveServer/:serverId',
            asyncHandler((req, res) => this.controller.leaveServer(req, res)),
        );
        this.router.post(
            '/editServer/:serverId',
            asyncHandler((req, res) => this.controller.editServer(req, res)),
        );
        this.router.post(
            '/createServer',
            asyncHandler((req, res) => this.controller.createServer(req, res)),
        );
    }
}

//export default new ServerRoutes().router;
