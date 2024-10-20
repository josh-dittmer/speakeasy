import { Request, Response, NextFunction } from 'express';

export function auth(req: Request, res: Response, next: NextFunction) {
    console.log('WARNING: Using fake auth!');
    res.locals.userId = 'b01c318d-a6d4-42ef-bd5c-92b777e357ad';

    next();
}