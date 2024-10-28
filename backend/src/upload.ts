/*import { Request } from 'express';

import multer, { FileFilterCallback } from 'multer';*/

/*const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    console.log(file.mimetype);
    if (allowedMimes.find((m) => m === file.mimetype)) {
        return cb(null, true);
    }

    cb(null, false);
};

const uploadsFolder = 'data/uploads/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsFolder);
    },
    filename: (req, file, cb) => {
        cb(null, crypto.randomUUID());
    }
});

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    /*limits: {
        fileSize: 1000 * 1000 * 10/*mb,
        files: 10
    }
})*/