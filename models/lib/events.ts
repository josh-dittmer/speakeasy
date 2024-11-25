import * as t from 'io-ts';

// event types
const MessageSent = t.literal('MESSAGE_SENT');
const MessageDeleted = t.literal('MESSAGE_DELETED');
const MessageEdited = t.literal('MESSAGE_EDITED');

const ChannelCreated = t.literal('CHANNEL_CREATED');
const ChannelDeleted = t.literal('CHANNEL_DELETED');
const ChannelEdited = t.literal('CHANNEL_EDITED');

const EventType = t.union([ 
    MessageSent, MessageDeleted, MessageEdited,
    ChannelCreated, ChannelDeleted, ChannelEdited
]);

export const Event = t.type({
    type: EventType,
    clientId: t.string,
    userId: t.string,
    serverId: t.string,
    channelId: t.union([ t.string, t.null ]),
});

export type EventT = t.TypeOf<typeof Event>;