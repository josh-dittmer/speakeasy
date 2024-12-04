import { isLeft } from 'fp-ts/lib/Either';
import * as t from 'io-ts';
import { endpoints } from '../api/endpoints';
import { createAuth } from './util';

export async function createLoginUrl(clientId: string, clearSession: boolean): Promise<string> {
    const { state, verifier, challenge } = await createAuth();

    sessionStorage.setItem('state', state);
    sessionStorage.setItem('verifier', verifier);

    const url = new URL(`${endpoints.AUTH_API}/oauth2/authorize`);
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('redirect_uri', endpoints.CALLBACK_URL);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', '');
    url.searchParams.set('state', state);
    url.searchParams.set('code_challenge', challenge);
    url.searchParams.set('code_challenge_method', 'S256');

    if (clearSession) {
        url.searchParams.set('clear_session', '1');
    }

    return url.href;
}

const TokenResponse = t.type({
    token_type: t.string,
    access_token: t.string,
    refresh_token: t.string,
    expires_in: t.number,
    scope: t.string,
});

type TokenResponseT = t.TypeOf<typeof TokenResponse>;

export const TokenStorageNames = {
    accessToken: 'access_token',
    refreshToken: 'refresh_token',
    expiration: 'expiration',
};

async function authRequest(data: object) {
    const response = await fetch(`${endpoints.AUTH_API}/oauth2/token`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const parsed: unknown = await response.json();

    const decoded = TokenResponse.decode(parsed);
    if (isLeft(decoded)) {
        throw new Error('invalid auth server response');
    }

    const tokens: TokenResponseT = decoded.right;

    const expiration = Date.now() + tokens.expires_in * 1000;

    localStorage.setItem(TokenStorageNames.accessToken, tokens.access_token);
    localStorage.setItem(TokenStorageNames.refreshToken, tokens.refresh_token);
    localStorage.setItem(TokenStorageNames.expiration, expiration.toString());

    return tokens.access_token;
}

export async function handleCallback(clientId: string, code: string, state: string) {
    const storedState = sessionStorage.getItem('state');
    const storedVerifier = sessionStorage.getItem('verifier');

    sessionStorage.removeItem('state');
    sessionStorage.removeItem('verifier');

    if (!storedState || !storedVerifier) {
        throw new Error('session data missing');
    }

    if (state !== storedState) {
        throw new Error('state mistmatch');
    }

    const data = {
        grant_type: 'authorization_code',
        code: code,
        client_id: clientId,
        client_secret: null,
        redirect_uri: endpoints.CALLBACK_URL,
        code_verifier: storedVerifier,
    };

    await authRequest(data);
}

export async function handleRefresh(clientId: string, refreshToken: string): Promise<string> {
    const data = {
        grant_type: 'refresh_token',
        client_id: clientId,
        refresh_token: refreshToken,
    };

    return await authRequest(data);
}

function pastExpiration(expiration: string): boolean {
    return Date.now() >= Number.parseInt(expiration);
}

export async function getAccessToken(clientId: string): Promise<string> {
    let accessToken = localStorage.getItem(TokenStorageNames.accessToken);

    if (!accessToken) throw new Error('access token not found');

    const refreshToken = localStorage.getItem(TokenStorageNames.refreshToken);
    const expiration = localStorage.getItem(TokenStorageNames.expiration);

    if (refreshToken && expiration && pastExpiration(expiration)) {
        accessToken = await handleRefresh(clientId, refreshToken);
    }

    return accessToken;
}

async function revokeRequest(data: object) {
    const response = await fetch(`${endpoints.AUTH_API}/oauth2/revoke`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (response.status !== 200) throw new Error('revoke request failed');
}

export async function handleRevokeTokens(clientId: string) {
    //const accessToken = localStorage.getItem(TokenStorageNames.accessToken);
    const refreshToken = localStorage.getItem(TokenStorageNames.refreshToken);

    localStorage.removeItem(TokenStorageNames.accessToken);
    localStorage.removeItem(TokenStorageNames.refreshToken);
    localStorage.removeItem(TokenStorageNames.expiration);

    /*if (accessToken) {
        await revokeRequest({
            token: accessToken,
            token_type_hint: 'access_token',
            client_id: clientId,
            client_secret: null
        });
    }*/

    if (refreshToken) {
        await revokeRequest({
            token: refreshToken,
            token_type_hint: 'refresh_token',
            client_id: clientId,
            client_secret: null,
        });
    }
}
