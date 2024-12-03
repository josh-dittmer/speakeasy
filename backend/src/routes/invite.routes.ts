import { Router } from 'express';
import { FileController } from '../controllers/file.controller';
import { SIOServer } from '../socket.io/sio_server';
import { InviteController } from '../controllers/invite.controller';

export class InviteRoutes {
    public router: Router;
    private controller: InviteController;

    constructor(sioServer: SIOServer) {
        this.router = Router();
        this.controller = new InviteController(sioServer);
        this.init();
    }

    private init() {
        this.router.post('/createInvite', (req, res) => this.controller.createInvite(req, res));
        this.router.get('/consumeInvite/:inviteId', (req, res) => this.controller.createInvite(req, res));
        this.router.get('/previewInvite/:inviteId', (req, res) => this.controller.createInvite(req, res));   
    }
}