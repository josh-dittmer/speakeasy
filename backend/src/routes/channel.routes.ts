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
        this.router.get('/getChannelData/:channelId', this.controller.getChannelData);
        this.router.post('/createChannel', this.controller.createChannel);
        this.router.post('/editChannel/:channelId', this.controller.editChannel);
        this.router.delete('/deleteChannel/:channelId', this.controller.deleteChannel);
    }
}

//export default new ChannelRoutes().router;