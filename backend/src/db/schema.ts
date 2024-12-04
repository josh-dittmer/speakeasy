import { boolean, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import {
    maxChannelNameLength,
    maxMessageLength,
    maxServerNameLength,
    maxUserBioLength,
    maxUserNameLength,
} from 'models';

export const serversTable = pgTable('servers', {
    //id: integer().primaryKey().generatedAlwaysAsIdentity(),
    serverId: uuid()
        .unique()
        .notNull()
        .primaryKey()
        .$default(() => crypto.randomUUID()),
    imageId: uuid(),
    name: varchar({ length: maxServerNameLength }).notNull(),
});

export const usersTable = pgTable('users', {
    //id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: uuid()
        .primaryKey()
        .unique()
        .notNull()
        .$default(() => crypto.randomUUID()),
    imageId: uuid(),
    name: varchar({ length: maxUserNameLength }).notNull(),
    bio: varchar({ length: maxUserBioLength }),
});

export const membershipsTable = pgTable('memberships', {
    id: uuid()
        .primaryKey()
        .unique()
        .notNull()
        .$default(() => crypto.randomUUID()),
    serverId: uuid()
        .notNull()
        .references(() => serversTable.serverId),
    userId: uuid()
        .notNull()
        .references(() => usersTable.userId),
});

export const channelsTable = pgTable('channels', {
    //id: integer().primaryKey().generatedAlwaysAsIdentity(),
    channelId: uuid()
        .primaryKey()
        .unique()
        .notNull()
        .$default(() => crypto.randomUUID()),
    serverId: uuid()
        .notNull()
        .references(() => serversTable.serverId),
    name: varchar({ length: maxChannelNameLength }).notNull(),
});

export const messagesTable = pgTable('messages', {
    //id: integer().primaryKey().generatedAlwaysAsIdentity(),
    messageId: uuid()
        .primaryKey()
        .unique()
        .notNull()
        .$default(() => crypto.randomUUID()),
    userId: uuid()
        .notNull()
        .references(() => usersTable.userId),
    channelId: uuid()
        .notNull()
        .references(() => channelsTable.channelId, { onDelete: 'cascade' }),
    serverId: uuid()
        .notNull()
        .references(() => serversTable.serverId),
    content: varchar({ length: maxMessageLength }).notNull(),
    date: timestamp().notNull().defaultNow(),
    hasFiles: boolean().notNull().default(false),
});

export const filesTable = pgTable('files', {
    fileId: uuid()
        .primaryKey()
        .unique()
        .notNull()
        .$default(() => crypto.randomUUID()),
    messageId: uuid().references(() => messagesTable.messageId, { onDelete: 'cascade' }),
    serverId: uuid().references(() => serversTable.serverId),
    userId: uuid().references(() => usersTable.userId),
    name: varchar({ length: 255 }).notNull(),
    mimeType: varchar({ length: 255 }).notNull(),
});

export const invitesTable = pgTable('invites', {
    inviteId: uuid()
        .primaryKey()
        .unique()
        .notNull()
        .$default(() => crypto.randomUUID()),
    serverId: uuid()
        .notNull()
        .references(() => serversTable.serverId),
    userId: uuid()
        .notNull()
        .references(() => usersTable.userId),
    createdAt: timestamp().notNull().defaultNow(),
    expiresAt: timestamp(),
});
