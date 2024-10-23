import { Router } from 'express';
import { getChannelData } from '../controllers/channel.controller';

class ChannelRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router.get('/getChannelData/:channelId', getChannelData);
    }
}

export default new ChannelRoutes().router;