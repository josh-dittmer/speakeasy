import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { SIOServer } from '../socket.io/sio_server';
import { asyncHandler } from '../util/async_error_handler';
//import { getLastVisitedServer } from '../controllers/user.controller';

export class UserRoutes {
    public router: Router;
    private controller: UserController;

    constructor(sioServer: SIOServer) {
        this.router = Router();
        this.controller = new UserController(sioServer);
        this.init();
    }

    private init() {
        this.router.get(
            '/getMyUserData',
            asyncHandler((req, res) => this.controller.getMyUserData(req, res)),
        );
        this.router.get(
            '/isMyProfileComplete',
            asyncHandler((req, res) => this.controller.isMyProfileComplete(req, res)),
        );
        this.router.post(
            '/editUserProfile',
            asyncHandler((req, res) => this.controller.editUserProfile(req, res)),
        );
        this.router.post(
            '/createUserProfile',
            asyncHandler((req, res) => this.controller.createUserProfile(req, res)),
        );
    }
}

//export default new UserRoutes().router;
