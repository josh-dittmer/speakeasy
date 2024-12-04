import { NextFunction, Request, Response } from 'express';
import { unauthorized } from '../common/response';
import { auth } from './auth';

export async function expressAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return unauthorized(res);
    }

    const token = req.headers.authorization.substring(7);

    try {
        const data = await auth(token);

        res.locals.userId = data.sub;
        res.locals.userEmail = data.email;

        console.log(`[http] [${data.email}] ${req.method} ${req.path}`);
    } catch {
        return unauthorized(res);
    }

    next();
}
