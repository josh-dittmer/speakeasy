import { getClientId, navigate } from '@/app/actions';
import { isLeft } from 'fp-ts/Either';
import * as t from 'io-ts';
import { PathReporter } from 'io-ts/PathReporter';
import {
    ChannelData,
    ChannelDataT,
    ConsumeInviteResponse,
    CreateChannelRequestT,
    CreateChannelResponse,
    CreateChannelResponseT,
    CreateInviteRequestT,
    CreateInviteResponse,
    CreateInviteResponseT,
    CreateMessageRequestT,
    CreateMessageResponse,
    CreateMessageResponseT,
    CreateProfileRequestT,
    CreateProfileResponse,
    CreateProfileResponseT,
    CreateServerRequestT,
    CreateServerResponse,
    CreateServerResponseT,
    DeleteChannelRequestT,
    DeleteMessageRequestT,
    EditChannelRequestT,
    EditProfileRequestT,
    EditProfileResponse,
    EditProfileResponseT,
    EditServerRequestT,
    EditServerResponse,
    EditServerResponseT,
    IsMyProfileCompleteResponse,
    IsMyProfileCompleteResponseT,
    LeaveServerRequestT,
    PreviewInviteResponse,
    PreviewInviteResponseT,
    ServerArray,
    ServerArrayT,
    ServerData,
    ServerDataT,
    User,
    UserT,
} from 'models';
import { getAccessToken } from '../auth/auth';
import { endpoints } from './endpoints';

const getReq = (): RequestInit => {
    const init: RequestInit = {
        cache: 'no-store',
        method: 'get',
    };

    return init;
};

const postReq = <ReqType>(data: ReqType): RequestInit => {
    const init: RequestInit = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };

    return init;
};

const postReqMultipart = (data: FormData): RequestInit => {
    const init: RequestInit = {
        method: 'post',
        body: data,
    };

    return init;
};

const deleteReq = <ReqType>(data: ReqType): RequestInit => {
    const init: RequestInit = {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };

    return init;
};

async function request(url: string, data: RequestInit, useAuth: boolean = true): Promise<Response> {
    if (useAuth) {
        try {
            const accessToken = await getAccessToken(await getClientId());

            data.headers = new Headers(data.headers);
            data.headers.set('Authorization', `Bearer ${accessToken}`);
        } catch {
            navigate('/login');
        }
    }

    const response = await fetch(url, data);

    // if request fails due to auth error, prompt user to log in again
    if (response.status === 401) {
        navigate('/login');
    } else if (response.status !== 200) {
        throw new Error('request failed');
    }

    return response;
}

async function requestAndDecode<C extends t.Mixed>(
    path: string,
    data: RequestInit,
    decoder: C,
): Promise<t.TypeOf<typeof decoder>> {
    const response: Response = await request(`${endpoints.MAIN_API}${path}`, data);
    const parsed: unknown = await response.json();

    const decoded = decoder.decode(parsed);
    if (isLeft(decoded)) {
        throw new Error(`could not validate data: ${PathReporter.report(decoded).join('\n')}`);
    }

    type C_T = t.TypeOf<typeof decoder>;

    const res: C_T = decoded.right;
    return res;
}

// for purging cache
export const Tags = {
    serverData: 'serverData',
    channelData: 'channelData',
    myself: 'myself',
};

export async function getServerList(): Promise<ServerArrayT> {
    return await requestAndDecode('/getServerList', getReq(), ServerArray);
}

export async function getServerData(serverId: string): Promise<ServerDataT> {
    return await requestAndDecode(`/getServerData/${serverId}`, getReq(), ServerData);
}

export async function getChannelData(channelId: string, page: number): Promise<ChannelDataT> {
    return await requestAndDecode(
        `/getChannelData/${channelId}?page=${page}`,
        getReq(),
        ChannelData,
    );
}

export async function getMyUserData(): Promise<UserT> {
    return await requestAndDecode('/getMyUserData', getReq(), User);
}

export async function isMyProfileComplete(): Promise<IsMyProfileCompleteResponseT> {
    return await requestAndDecode('/isMyProfileComplete', getReq(), IsMyProfileCompleteResponse);
}

export async function createMessage(
    createMessageRequest: CreateMessageRequestT,
): Promise<CreateMessageResponseT> {
    return await requestAndDecode(
        `/createMessage`,
        postReq(createMessageRequest),
        CreateMessageResponse,
    );
}

export async function createChannel(
    createChannelRequest: CreateChannelRequestT,
): Promise<CreateChannelResponseT> {
    return await requestAndDecode(
        `/createChannel`,
        postReq(createChannelRequest),
        CreateChannelResponse,
    );
}

export async function createServer(
    createServerRequest: CreateServerRequestT,
): Promise<CreateServerResponseT> {
    return await requestAndDecode(
        '/createServer',
        postReq(createServerRequest),
        CreateServerResponse,
    );
}

export async function createProfile(
    createProfileRequest: CreateProfileRequestT,
): Promise<CreateProfileResponseT> {
    return await requestAndDecode(
        '/createUserProfile',
        postReq(createProfileRequest),
        CreateProfileResponse,
    );
}

export async function editProfile(
    editProfileRequest: EditProfileRequestT,
): Promise<EditProfileResponseT> {
    return await requestAndDecode(
        '/editUserProfile',
        postReq(editProfileRequest),
        EditProfileResponse,
    );
}

export async function editChannel(channelId: string, editChannelRequest: EditChannelRequestT) {
    return await requestAndDecode(
        `/editChannel/${channelId}`,
        postReq(editChannelRequest),
        t.type({}),
    );
}

export async function editServer(
    serverId: string,
    editServerRequest: EditServerRequestT,
): Promise<EditServerResponseT> {
    return await requestAndDecode(
        `/editServer/${serverId}`,
        postReq(editServerRequest),
        EditServerResponse,
    );
}

export async function leaveServer(serverId: string, leaveServerRequest: LeaveServerRequestT) {
    return await requestAndDecode(
        `/leaveServer/${serverId}`,
        postReq(leaveServerRequest),
        t.type({}),
    );
}

export async function deleteMessage(
    messageId: string,
    deleteMessageRequest: DeleteMessageRequestT,
) {
    return await requestAndDecode(
        `/deleteMessage/${messageId}`,
        deleteReq(deleteMessageRequest),
        t.type({}),
    );
}

export async function deleteChannel(
    channelId: string,
    deleteChannelRequest: DeleteChannelRequestT,
) {
    return await requestAndDecode(
        `/deleteChannel/${channelId}`,
        deleteReq(deleteChannelRequest),
        t.type({}),
    );
}

export async function createInvite(
    createInviteRequest: CreateInviteRequestT,
): Promise<CreateInviteResponseT> {
    return await requestAndDecode(
        `/createInvite`,
        postReq(createInviteRequest),
        CreateInviteResponse,
    );
}

export async function consumeInvite(inviteId: string) {
    return await requestAndDecode(`/consumeInvite/${inviteId}`, getReq(), ConsumeInviteResponse);
}

export async function previewInvite(inviteId: string): Promise<PreviewInviteResponseT> {
    return await requestAndDecode(`/previewInvite/${inviteId}`, getReq(), PreviewInviteResponse);
}

export type UploadFileData = {
    uploadUrl: string;
    file: File;
    fields: unknown;
};

export async function uploadFile(data: UploadFileData) {
    const form = new FormData();

    // for aws s3
    const fieldsObj = data.fields as object;
    Object.entries(fieldsObj).forEach(([field, value]) => {
        form.append(field, value as string);
    });

    form.append('file', data.file);

    await request(data.uploadUrl, postReqMultipart(form), false);

    return true;
}

export async function downloadFile(fileLocation: string, fileId: string) {
    const res = await request(`${endpoints.MAIN_API}/getFile/${fileLocation}/${fileId}`, getReq());
    return await res.blob();
}
