import * as t from 'io-ts';

export const Server = t.type({
    serverId: t.string,
    imageId: t.union([ t.string, t.null ]),
    name: t.string
})

export type ServerT = t.TypeOf<typeof Server>;

export const ServerArray = t.array(Server);
export type ServerArrayT = t.TypeOf<typeof ServerArray>;

export const LastVisitedServer = t.type({
    serverId: t.string
})

export type LastVisitedServerT = t.TypeOf<typeof LastVisitedServer>;

export const Channel = t.type({
    channelId: t.string,
    serverId: t.string,
    name: t.string
})

export type ChannelT = t.TypeOf<typeof Channel>

export const ChannelArray = t.array(Channel);
export type ChannelArrayT = t.TypeOf<typeof ChannelArray>;

export const LastVisitedChannel = t.type({
    channelId: t.string
});

export type LastVisitedChannelT = t.TypeOf<typeof LastVisitedChannel>;

export const GetLastVisitedChannelReq = t.type({
    serverId: t.string
});

export type GetLastVisitedChannelReqT = t.TypeOf<typeof GetLastVisitedChannelReq>;

export const GetChannelListReq = t.type({
    serverId: t.string
});

export type GetChannelListReqT = t.TypeOf<typeof GetChannelListReq>;