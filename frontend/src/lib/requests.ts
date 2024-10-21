import { ChannelArray, ChannelArrayT, GetChannelListReqT, GetLastVisitedChannelReqT, LastVisitedChannel, LastVisitedChannelT, LastVisitedServer, LastVisitedServerT, ServerArray, ServerArrayT } from 'models';
import { endpoints } from './endpoints';
import { isLeft } from 'fp-ts/Either'
import * as t from 'io-ts';
import { Type } from 'io-ts';

const getReq = (): RequestInit => {
    const init: RequestInit = {
        cache: 'no-store',
        method: 'get'
    };

    return init;
}

const postReq = <ReqType>(data: ReqType): RequestInit => {
    const init: RequestInit = {
        cache: 'no-store',
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    return init;
}

async function request<C extends t.Mixed>(path: string, data: RequestInit, decoder: C): Promise<t.TypeOf<typeof decoder>> {
    console.log('TEST ' + path);
    
    const response = await fetch(`${endpoints.MAIN_API}${path}`, data);

    const parsed: unknown = await response.json();

    const decoded = decoder.decode(parsed);
    if (isLeft(decoded)) {
        throw new Error('Failed to parse server response');
    }

    type C_T = t.TypeOf<typeof decoder>;

    const res: C_T = decoded.right;
    return res;
}

export async function getChannelList(serverId: string): Promise<ChannelArrayT> {
    let req: GetChannelListReqT = {
        serverId: serverId
    }
    
    return await request('/getChannelList', postReq(req), ChannelArray);
}

export async function getLastVisitedChannel(serverId: string): Promise<LastVisitedChannelT> {
    let req: GetLastVisitedChannelReqT = {
        serverId: serverId
    };

    return await request('/getLastVisitedChannel', postReq(req), LastVisitedChannel);
}

export async function getServerList(): Promise<ServerArrayT> {
    return await request('/getServerList', getReq(), ServerArray);
}

export async function getLastVisitedServer(): Promise<LastVisitedServerT> {
    return await request('/getLastVisitedServer', getReq(), LastVisitedServer);
}
