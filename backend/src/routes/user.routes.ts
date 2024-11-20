import { Router } from 'express';
import { editUserProfile, getMyUserData, isMyProfileComplete } from '../controllers/user.controller';
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
    }
}

export default new UserRoutes().router;