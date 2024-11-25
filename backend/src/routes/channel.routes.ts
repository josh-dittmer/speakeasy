import { Router } from 'express';
import { ChannelController } from '../controllers/channel.controller';
import { SIOServer } from '../socket.io/sio_server';

export class ChannelRoutes {
    public router: Router;
    private controller: ChannelController;

    constructor(sioServer: SIOServer) {
        this.router = Router();
        this.controller = new ChannelController(sioServer);
        this.init();
    }

    private init() {
        this.router.get('/getChannelData/:channelId', (req, res) => this.controller.getChannelData(req, res));
        this.router.post('/createChannel', (req, res) => this.controller.createChannel(req, res));
        this.router.post('/editChannel/:channelId', (req, res) => this.controller.editChannel(req, res));
        this.router.delete('/deleteChannel/:channelId', (req, res) => this.controller.deleteChannel(req, res));
    }
}

//export default new ChannelRoutes().router;