import { Router } from 'express';
import { ChannelController } from '../controllers/channel.controller';
import { SIOServer } from '../socket.io/sio_server';
import { asyncHandler } from '../util/async_error_handler';

export class ChannelRoutes {
    public router: Router;
    private controller: ChannelController;

    constructor(sioServer: SIOServer) {
        this.router = Router();
        this.controller = new ChannelController(sioServer);
        this.init();
    }

    private init() {
        this.router.get(
            '/getChannelData/:channelId',
            asyncHandler((req, res) => this.controller.getChannelData(req, res)),
        );
        this.router.post(
            '/createChannel',
            asyncHandler((req, res) => this.controller.createChannel(req, res)),
        );
        this.router.post(
            '/editChannel/:channelId',
            asyncHandler((req, res) => this.controller.editChannel(req, res)),
        );
        this.router.delete(
            '/deleteChannel/:channelId',
            asyncHandler((req, res) => this.controller.deleteChannel(req, res)),
        );
    }
}

//export default new ChannelRoutes().router;
