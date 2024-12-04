import { ExtendedError, Socket } from 'socket.io';
import { auth } from './auth';

export async function sioAuth(socket: Socket, next: (err?: ExtendedError) => void) {
    if (!socket.handshake.auth.token || !socket.handshake.auth.clientId) {
        return next(new Error('missing handshake data'));
    }

    try {
        const data = await auth(socket.handshake.auth.token);

        socket.data.userId = data.sub;
        socket.data.userEmail = data.email;
        socket.data.clientId = socket.handshake.auth.clientId;
    } catch {
        return next(new Error('token verification failed'));
    }

    next();
}
