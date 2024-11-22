import { Router } from 'express';
import { createUserProfile, editUserProfile, getMyUserData, isMyProfileComplete } from '../controllers/user.controller';
//import { getLastVisitedServer } from '../controllers/user.controller';

class UserRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router.get('/getMyUserData', getMyUserData);
        this.router.get('/isMyProfileComplete', isMyProfileComplete);
        this.router.post('/editUserProfile', editUserProfile);
        this.router.post('/createUserProfile', createUserProfile);
    }
}

export default new UserRoutes().router;