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
        this.router.get('/getMyUserData', (req, res) => this.controller.getMyUserData(req, res));
        this.router.get('/isMyProfileComplete', (req, res) => this.controller.isMyProfileComplete(req, res));
        this.router.post('/editUserProfile', (req, res) => this.controller.editUserProfile(req, res));
        this.router.post('/createUserProfile', (req, res) => this.controller.createUserProfile(req, res));
    }
}

//export default new UserRoutes().router;