import { Router } from 'express';
import { FileController } from '../controllers/file.controller';
import { SIOServer } from '../socket.io/sio_server';
import { asyncHandler } from '../util/async_error_handler';

export class FileRoutes {
    public router: Router;
    private controller: FileController;

    constructor(sioServer: SIOServer) {
        this.router = Router();
        this.controller = new FileController(sioServer);
        this.init();
    }

    private init() {
        this.router.get(
            '/getFile/:type/:fileId',
            asyncHandler((req, res) => this.controller.getFile(req, res)),
        );
    }
}

//export default new FileRoutes().router;
