import { Router } from 'express';
import { getChannelList } from '../controllers/channel.controller';

class ChannelRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router.post('/getChannelList', getChannelList);
    }
}

export default new ChannelRoutes().router;