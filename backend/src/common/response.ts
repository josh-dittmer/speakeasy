import { Response } from 'express';

export function badRequest(res: Response) {
    res.status(400).send({
        message: 'invalid request body'
    });
}

export function notFound(res: Response, what: string) {
    res.status(404).send({
        message: `${what} not found`
    });
}

export function forbidden(res: Response) {
    res.status(403).send({
        message: 'unauthorized to access selected resource'
    });
}

export function serverError(res: Response) {
    res.status(500).send({
        message: 'internal server error'
    });
}