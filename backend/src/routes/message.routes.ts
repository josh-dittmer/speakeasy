import { Router } from 'express';
import { MessageController } from '../controllers/message.controller';
import { SIOServer } from '../socket.io/sio_server';

export class MessageRoutes {
    public router: Router;
    private controller: MessageController;

    constructor(sioServer: SIOServer) {
        this.router = Router();
        this.controller = new MessageController(sioServer);
        this.init();
    }

    private init() {
        this.router.post('/createMessage', this.controller.createMessage);
        this.router.delete('/deleteMessage/:messageId', this.controller.deleteMessage);
    }
}

//export default new MessageRoutes().router;