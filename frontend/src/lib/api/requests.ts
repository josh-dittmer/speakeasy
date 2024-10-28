import { ChannelData, ChannelDataT, CreateMessageRequestT, CreateMessageResponse, CreateMessageResponseT, ServerArray, ServerArrayT, ServerData, ServerDataT, User, UserT } from 'models';
import { endpoints } from './endpoints';
import { isLeft } from 'fp-ts/Either'
import * as t from 'io-ts';
import { PathReporter } from "io-ts/PathReporter";
import { revalidateTag } from 'next/cache';

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

const postReqMultipart = (data: FormData): RequestInit => {
    const init: RequestInit = {
        method: 'post',
        body: data
    }

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

async function request(url: string, data: RequestInit): Promise<Response> {
    const response = await fetch(url, data);
    if (response.status !== 200) {
        throw new Error('request failed');
    }

    return response;
}

async function requestAndDecode<C extends t.Mixed>(path: string, data: RequestInit, decoder: C): Promise<t.TypeOf<typeof decoder>> {
    const response: Response = await request(`${endpoints.MAIN_API}${path}`, data);
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
    myself: 'myself'
}

export async function getServerList(): Promise<ServerArrayT> {
    const usedTags = [Tags.servers];
    return await requestAndDecode('/getServerList', getReq(usedTags), ServerArray);
}

export async function getServerData(serverId: string): Promise<ServerDataT> {
    const usedTags = [serverId];
    return await requestAndDecode(`/getServerData/${serverId}`, getReq(usedTags), ServerData);
}

export async function getChannelData(channelId: string, page: number): Promise<ChannelDataT> {
    const usedTags = [channelId];
    return await requestAndDecode(`/getChannelData/${channelId}?page=${page}`, getReq(usedTags), ChannelData);
}

export async function getMyUserData(): Promise<UserT> {
    const usedTags = [Tags.myself]
    return await requestAndDecode('/getMyUserData', getReq(usedTags), User);
}

export async function createMessage(createMessageRequest: CreateMessageRequestT): Promise<CreateMessageResponseT> {
    //const data: FormData = createMessageRequestToFormData(createMessageRequest);
    return await requestAndDecode(`/createMessage`, postReq(createMessageRequest), CreateMessageResponse);
}

export type UploadFileData = {
    uploadUrl: string,
    file: File,
    fields: unknown
}

export async function uploadFile(data: UploadFileData): Promise<Response> {
    const form = new FormData();
    
    const fieldsObj = data.fields as any;
    Object.entries(fieldsObj).forEach(([field, value]) => {
        form.append(field, value as string);
    })

    form.append('file', data.file);

    return await request(data.uploadUrl, postReqMultipart(form));
}