import { Router } from 'express';
import { getLastVisitedServer } from '../controllers/user.controller';

class UserRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router.get('/getLastVisitedServer', getLastVisitedServer);
    }
}

export default new UserRoutes().router;