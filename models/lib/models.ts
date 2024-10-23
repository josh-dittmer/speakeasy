import * as t from 'io-ts';

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

export const Message = t.type({
    messageId: t.string,
    userId: t.string,
    channelId: t.string,
    serverId: t.string,
    content: t.string,
    date: t.string
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
