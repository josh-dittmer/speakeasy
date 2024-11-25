import { Request, Response, NextFunction } from 'express';
import { serverError, unauthorized } from '../common/response';
import { auth } from './auth';

export async function expressAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return unauthorized(res);
    }

    const token = req.headers.authorization.substring(7);

    try {
        const data = await auth(token);

        if (!data.sub || !data.email) {
            return serverError(res);
        }

        res.locals.userId = data.sub;
        res.locals.userEmail = data.email;

        console.log(`[http] [${data.email}] ${req.method} ${req.path}`);
    } catch(err) {
        return unauthorized(res);
    }

    next();
}