import { ChannelArray, ChannelArrayT, ChannelData, ChannelDataT, ServerArray, ServerArrayT, ServerData, ServerDataT } from 'models';
import { endpoints } from './endpoints';
import { isLeft } from 'fp-ts/Either'
import * as t from 'io-ts';
import { PathReporter } from "io-ts/PathReporter";

const getReq = (tags: Array<string>): RequestInit => {
    const init: RequestInit = {
        next: {
            tags: tags
        },
        //cache: 'no-store',
        method: 'get'
    };

    return init;
}

const postReq = <ReqType>(data: ReqType): RequestInit => {
    const init: RequestInit = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    return init;
}

async function request<C extends t.Mixed>(path: string, data: RequestInit, decoder: C): Promise<t.TypeOf<typeof decoder>> {
    const response = await fetch(`${endpoints.MAIN_API}${path}`, data);
    const parsed: unknown = await response.json();

    const decoded = decoder.decode(parsed);
    if (isLeft(decoded)) {
        throw new Error(`Could not validate data: ${PathReporter.report(decoded).join("\n")}`);
    }

    type C_T = t.TypeOf<typeof decoder>;

    const res: C_T = decoded.right;
    return res;
}

// for purging cache
export const Tags = {
    servers: 'servers',
    channels: 'channels',
    users: 'users',
    messages: 'messages'
}

export async function getServerList(): Promise<ServerArrayT> {
    const usedTags = [Tags.servers];
    return await request('/getServerList', getReq(usedTags), ServerArray);
}

export async function getServerData(serverId: string): Promise<ServerDataT> {
    const usedTags = [Tags.servers, Tags.channels, Tags.users];
    return await request(`/getServerData/${serverId}`, getReq(usedTags), ServerData);
}

export async function getChannelData(channelId: string, page: number): Promise<ChannelDataT> {
    const usedTags = [Tags.users, Tags.messages];
    return await request(`/getChannelData/${channelId}?page=${page}`, getReq(usedTags), ChannelData);
}