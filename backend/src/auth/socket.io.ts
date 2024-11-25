import { ExtendedError, Socket } from 'socket.io';
import { auth } from './auth';

export async function sioAuth(socket: Socket, next: (err?: ExtendedError) => void) {    
    if (!socket.handshake.auth.token) {
        return next(new Error('missing token'));
    }

    try {
        const data = await auth(socket.handshake.auth.token);

        socket.data.userId = data.sub;
        socket.data.userEmail = data.email;

        console.log(`[gateway] ${data.email} has connected`);
    } catch(err) {
        return next(new Error('token verification failed'));
    }

    next();
}