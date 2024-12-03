import * as t from 'io-ts';

export * from './events';

export const allowedImageMimes = [
    'image/png',
    'image/jpeg',
    'image/gif'
];

export const allowedMimes = [
    ...allowedImageMimes
];

export const maxFileSize = 1000 * 1000 * 10;/*mb*/

export const maxNumFiles = 5;

export const S3Keys = {
    messageFiles: 'messageFiles',
    profileImgs: 'profileImgs',
    serverImgs: 'serverImgs'
}

export const maxMessageLength = 2047;

export const maxChannelNameLength = 255;

export const maxServerNameLength = 255;

export const maxUserNameLength = 255;
export const maxUserBioLength = 511;

export const welcomeServerId = '045a66e6-30cb-4d05-916e-4debe61b9413';

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

export const UserStatus = t.union([
    t.literal('ONLINE'), t.literal('OFFLINE')
]);

export type UserStatusT = t.TypeOf<typeof UserStatus>;

export const User = t.type({
    userId: t.string,
    imageId: t.union([ t.string, t.null ]),
    name: t.string,
    bio: t.union([ t.string, t.null ]),
    status: UserStatus
});

export type UserT = t.TypeOf<typeof User>;

export const UserArray = t.array(User);
export type UserArrayT = t.TypeOf<typeof UserArray>;

export const File = t.type({
    fileId: t.string,
    messageId: t.union([ t.string, t.null]),
    serverId: t.union([ t.string, t.null]),
    userId: t.union([ t.string, t.null]),
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
    date: t.number,
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

export const UploadRequest = t.type({
    name: t.string,
    mimeType: t.string
})

export type UploadRequestT = t.TypeOf<typeof UploadRequest>;

export const CreateMessageRequest = t.type({
    channelId: t.string,
    content: t.string,
    files: t.array(UploadRequest),
    clientId: t.string
});

export type CreateMessageRequestT = t.TypeOf<typeof CreateMessageRequest>;

export const DeleteMessageRequest = t.type({
    clientId: t.string
})

export type DeleteMessageRequestT = t.TypeOf<typeof DeleteMessageRequest>;

export const UploadResponse = t.type({
    fileId: t.string,
    url: t.string,
    name: t.string,
    fields: t.unknown
});

export type UploadResponseT = t.TypeOf<typeof UploadResponse>;

export const CreateMessageResponse = t.partial({
    uploads: t.array(UploadResponse)
});

export type CreateMessageResponseT = t.TypeOf<typeof CreateMessageResponse>;

export const CreateChannelRequest = t.type({
    serverId: t.string,
    name: t.string,
    clientId: t.string
});

export type CreateChannelRequestT = t.TypeOf<typeof CreateChannelRequest>;

export const CreateChannelResponse = t.type({
    serverId: t.string,
    channelId: t.string
})

export type CreateChannelResponseT = t.TypeOf<typeof CreateChannelResponse>;

export const DeleteChannelRequest = t.type({
    clientId: t.string
})

export type DeleteChannelRequestT = t.TypeOf<typeof DeleteChannelRequest>;

export const EditChannelRequest = t.type({
    name: t.string,
    clientId: t.string
})

export type EditChannelRequestT = t.TypeOf<typeof EditChannelRequest>;

export const EditServerRequest = t.type({
    name: t.string,
    image: t.union([ UploadRequest, t.null ]),
    clientId: t.string
});

export type EditServerRequestT = t.TypeOf<typeof EditServerRequest>;

export const EditServerResponse = t.partial({
    upload: UploadResponse
});

export type EditServerResponseT = t.TypeOf<typeof EditServerResponse>;

export const CreateServerRequest = t.type({
    name: t.string,
    image: t.union([ UploadRequest, t.null ]),
    clientId: t.string
});

export type CreateServerRequestT = t.TypeOf<typeof CreateServerRequest>;

export const CreateServerResponse = t.partial({
    upload: UploadResponse
});

export type CreateServerResponseT = t.TypeOf<typeof CreateServerResponse>;

export const LeaveServerRequest = t.type({
    clientId: t.string
})

export type LeaveServerRequestT = t.TypeOf<typeof LeaveServerRequest>;

export const EditProfileRequest = t.type({
    name: t.string,
    bio: t.string,
    image: t.union([ UploadRequest, t.null ]),
    clientId: t.string
});

export type EditProfileRequestT = t.TypeOf<typeof EditProfileRequest>;

export const EditProfileResponse = t.partial({
    upload: UploadResponse
});

export type EditProfileResponseT = t.TypeOf<typeof EditProfileResponse>;

export const CreateProfileRequest = t.type({
    name: t.string,
    bio: t.string,
    image: t.union([ UploadRequest, t.null ]),
    clientId: t.string
});

export type CreateProfileRequestT = t.TypeOf<typeof CreateProfileRequest>;

export const CreateProfileResponse = t.partial({
    upload: UploadResponse
});

export type CreateProfileResponseT = t.TypeOf<typeof CreateProfileResponse>;

export const IsMyProfileCompleteResponse = t.type({
    complete: t.boolean,
    email: t.string
})

export type IsMyProfileCompleteResponseT = t.TypeOf<typeof IsMyProfileCompleteResponse>;

export const CreateInviteRequest = t.type({
    serverId: t.string,
    validFor: t.union([ t.number, t.null ])
});

export type CreateInviteRequestT = t.TypeOf<typeof CreateInviteRequest>;

export const CreateInviteResponse = t.type({
    inviteId: t.string
})

export type CreateInviteResponseT = t.TypeOf<typeof CreateInviteResponse>;

export const ConsumeInviteResponse = t.type({
    success: t.boolean,
    expiresAt: t.union([ t.number, t.null ])
});

export type ConsumeInviteResponseT = t.TypeOf<typeof ConsumeInviteResponse>;

export const PreviewInviteResponse = t.type({
    serverName: t.string,
    serverImageId: t.union([ t.string, t.null ]),
    userName: t.string,
    expiresAt: t.union([ t.number, t.null ])
});

export type PreviewInviteResponseT = t.TypeOf<typeof PreviewInviteResponse>;