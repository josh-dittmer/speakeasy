import * as t from 'io-ts';

export const allowedMimes = [
    'image/png',
    'image/jpeg',
    'image/gif'
];

export const maxFileSize = 1000 * 1000 * 10;/*mb*/

export const maxNumFiles = 5;

export const S3Keys = {
    messageFiles: 'messageFiles',
    profileImgs: 'profileImgs',
    serverImgs: 'serverImgs'
}

export const maxChannelNameLength = 255;

export const Server = t.type({
    serverId: t.string,
    imageId: t.union([ t.string, t.null ]),
    name: t.string
})

export type ServerT = t.TypeOf<typeof Server>;

export const ServerArray = t.array(Server);
export type ServerArrayT = t.TypeOf<typeof ServerArray>;

export const Channel = t.type({
    channelId: t.string,
    serverId: t.string,
    name: t.string
})

export type ChannelT = t.TypeOf<typeof Channel>

export const ChannelArray = t.array(Channel);
export type ChannelArrayT = t.TypeOf<typeof ChannelArray>;

export const User = t.type({
    userId: t.string,
    imageId: t.union([ t.string, t.null ]),
    name: t.string,
    bio: t.union([ t.string, t.null ])
});

export type UserT = t.TypeOf<typeof User>;

export const UserArray = t.array(User);
export type UserArrayT = t.TypeOf<typeof UserArray>;

export const File = t.type({
    fileId: t.string,
    messageId: t.string,
    serverId: t.string,
    name: t.string,
    mimeType: t.string
});

export type FileT = t.TypeOf<typeof File>;

export const FileArray = t.array(File);
export type FileArrayT = t.TypeOf<typeof FileArray>;

export const Message = t.type({
    messageId: t.string,
    userId: t.string,
    channelId: t.string,
    serverId: t.string,
    content: t.string,
    date: t.string,
    isMine: t.boolean,
    files: FileArray
});

export type MessageT = t.TypeOf<typeof Message>;

export const MessageArray = t.array(Message);
export type MessageArrayT = t.TypeOf<typeof MessageArray>;

export const ServerData = t.type({
    server: Server,
    channels: ChannelArray,
    users: UserArray
})

export type ServerDataT = t.TypeOf<typeof ServerData>;

export const ChannelData = t.type({
    channel: Channel,
    messages: MessageArray
});

export type ChannelDataT = t.TypeOf<typeof ChannelData>;

export const CreateMessageRequest = t.type({
    channelId: t.string,
    content: t.string,
    files: t.array(t.type({
        name: t.string,
        mimeType: t.string
    }))
});

export type CreateMessageRequestT = t.TypeOf<typeof CreateMessageRequest>;

export const CreateMessageResponseUpload = t.type({
    fileId: t.string,
    url: t.string,
    name: t.string,
    fields: t.unknown
});

export type CreateMessageResponseUploadT = t.TypeOf<typeof CreateMessageResponseUpload>;

export const CreateMessageResponse = t.partial({
    uploads: t.array(CreateMessageResponseUpload)
});

export type CreateMessageResponseT = t.TypeOf<typeof CreateMessageResponse>;

export const CreateChannelRequest = t.type({
    serverId: t.string,
    name: t.string
});

export type CreateChannelRequestT = t.TypeOf<typeof CreateChannelRequest>;

export const CreateChannelResponse = t.type({
    serverId: t.string,
    channelId: t.string
})

export type CreateChannelResponseT = t.TypeOf<typeof CreateChannelResponse>;

export const EditChannelRequest = t.type({
    name: t.string
})

export type EditChannelRequestT = t.TypeOf<typeof EditChannelRequest>;

/*export function createMessageRequestToFormData(data: CreateMessageRequestT): FormData {
    const formData = new FormData();

    formData.append('channelId', data.channelId);
    formData.append('content', data.content);

    for (let i = 0; i < data.files.length; i++) {
        formData.append('files', data.files[i]);
    }

    return formData;
}*/