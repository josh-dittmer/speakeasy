import { Router } from 'express';
import { createMessage } from '../controllers/message.controller';

class MessageRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router.post('/createMessage', createMessage);
    }
}

export default new MessageRoutes().router;