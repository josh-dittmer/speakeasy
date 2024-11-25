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
        this.router.post('/createMessage', (req, res) => this.controller.createMessage(req, res));
        this.router.delete('/deleteMessage/:messageId', (req, res) => this.controller.deleteMessage(req, res));
    }
}

//export default new MessageRoutes().router;