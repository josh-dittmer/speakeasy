import { Router } from 'express';
import { FileController } from '../controllers/file.controller';
import { SIOServer } from '../socket.io/sio_server';

export class FileRoutes {
    public router: Router;
    private controller: FileController;

    constructor(sioServer: SIOServer) {
        this.router = Router();
        this.controller = new FileController(sioServer);
        this.init();
    }

    private init() {
        this.router.get('/getFile/:type/:fileId', this.controller.getFile);
    }
}

//export default new FileRoutes().router;