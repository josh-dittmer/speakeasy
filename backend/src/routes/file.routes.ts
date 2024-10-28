import { Router } from 'express';
import { getFile } from '../controllers/file.controller';

class FileRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router.get('/getFile/:fileId', getFile);
    }
}

export default new FileRoutes().router;