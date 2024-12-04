import { Router } from 'express';
import { InviteController } from '../controllers/invite.controller';
import { SIOServer } from '../socket.io/sio_server';
import { asyncHandler } from '../util/async_error_handler';

export class InviteRoutes {
    public router: Router;
    private controller: InviteController;

    constructor(sioServer: SIOServer) {
        this.router = Router();
        this.controller = new InviteController(sioServer);
        this.init();
    }

    private init() {
        this.router.post(
            '/createInvite',
            asyncHandler((req, res) => this.controller.createInvite(req, res)),
        );
        this.router.get(
            '/consumeInvite/:inviteId',
            asyncHandler((req, res) => this.controller.consumeInvite(req, res)),
        );
        this.router.get(
            '/previewInvite/:inviteId',
            asyncHandler((req, res) => this.controller.previewInvite(req, res)),
        );
    }
}
