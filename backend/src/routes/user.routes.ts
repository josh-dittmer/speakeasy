import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { SIOServer } from '../socket.io/sio_server';
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
        this.router.get('/getMyUserData', this.controller.getMyUserData);
        this.router.get('/isMyProfileComplete', this.controller.isMyProfileComplete);
        this.router.post('/editUserProfile', this.controller.editUserProfile);
        this.router.post('/createUserProfile', this.controller.createUserProfile);
    }
}

//export default new UserRoutes().router;