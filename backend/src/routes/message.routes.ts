import { Router } from 'express';
import { createMessage, deleteMessage } from '../controllers/message.controller';

class MessageRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router.post('/createMessage', createMessage);
        this.router.delete('/deleteMessage/:messageId', deleteMessage);
    }
}

export default new MessageRoutes().router;