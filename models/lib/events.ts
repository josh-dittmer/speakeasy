import * as t from 'io-ts';

export const EVENT_NAME = 'event_message';

// event types
const MessageSent = t.literal('MESSAGE_SENT');
const MessageDeleted = t.literal('MESSAGE_DELETED');
const MessageEdited = t.literal('MESSAGE_EDITED');

const ChannelCreated = t.literal('CHANNEL_CREATED');
const ChannelDeleted = t.literal('CHANNEL_DELETED');
const ChannelEdited = t.literal('CHANNEL_EDITED');

const ServerEdited = t.literal('SERVER_EDITED');
const ServerUserJoin = t.literal('SERVER_USER_JOIN');
const ServerUserLeave = t.literal('SERVER_USER_LEAVE');

const UserProfileEdited = t.literal('USER_PROFILE_EDITED');
const UserStatusChange = t.literal('USER_STATUS_CHANGE');

const EventType = t.union([ 
    MessageSent, MessageDeleted, MessageEdited,
    ChannelCreated, ChannelDeleted, ChannelEdited,
    ServerEdited, ServerUserJoin, ServerUserLeave,
    UserProfileEdited, UserStatusChange
]);

export const Event = t.type({
    type: EventType,
    clientId: t.string,
    userId: t.string,
    serverId: t.union([ t.string, t.null ]),
    channelId: t.union([ t.string, t.null ]),
});

export type EventT = t.TypeOf<typeof Event>;