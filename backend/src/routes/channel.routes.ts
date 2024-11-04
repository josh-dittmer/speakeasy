import { Router } from 'express';
import { createChannel, deleteChannel, editChannel, getChannelData } from '../controllers/channel.controller';

class ChannelRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router.get('/getChannelData/:channelId', getChannelData);
        this.router.post('/createChannel', createChannel);
        this.router.post('/editChannel/:channelId', editChannel);
        this.router.delete('/deleteChannel/:channelId', deleteChannel);
    }
}

export default new ChannelRoutes().router;