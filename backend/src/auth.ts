import { Request, Response, NextFunction } from 'express';
import { serverError, unauthorized } from './common/response';
import fs from 'fs';
import jwt from 'jsonwebtoken';

interface JothJwtPayload extends jwt.JwtPayload {
    email: string
};

export async function auth(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return unauthorized(res);
    }

    const secret = fs.readFileSync('./keys/private.key');
    const token = req.headers.authorization.substring(7);

    try {
        const decoded = <JothJwtPayload>jwt.verify(token, secret);

        if (!decoded.sub || !decoded.email) {
            return serverError(res);
        }

        res.locals.userId = decoded.sub;
        res.locals.userEmail = decoded.email;

        console.log(`[${decoded.email}] ${req.method} ${req.path}`);
    } catch(err) {
        return unauthorized(res);
    }

    next();
}