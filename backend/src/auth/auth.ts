import fs from 'fs';
import jwt from 'jsonwebtoken';

const secret = fs.readFileSync('./keys/private.key');

interface JothJwtPayload extends jwt.JwtPayload {
    email: string
};

export async function auth(token: string): Promise<JothJwtPayload> {
    const data = <JothJwtPayload>jwt.verify(token, secret);

    if (!data.sub || !data.email) {
        throw new Error('malformed jwt');
    }

    return data;
}