import { pgTable, varchar, uuid, timestamp, boolean } from 'drizzle-orm/pg-core';

export const serversTable = pgTable('servers', {
    //id: integer().primaryKey().generatedAlwaysAsIdentity(),
    serverId: uuid().unique().notNull().primaryKey().$default(() => crypto.randomUUID()),
    imageId: uuid(),
    name: varchar({ length: 255 }).notNull()
});

export const usersTable = pgTable('users', {
    //id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: uuid().primaryKey().unique().notNull().$default(() => crypto.randomUUID()),
    imageId: uuid(),
    name: varchar({ length: 255 }).notNull(),
    bio: varchar({ length: 511 }),
});

export const membershipsTable = pgTable('memberships', {
    id: uuid().primaryKey().unique().notNull().$default(() => crypto.randomUUID()),
    serverId: uuid().notNull().references(() => serversTable.serverId),
    userId: uuid().notNull().references(() => usersTable.userId),
});

export const channelsTable = pgTable('channels', {
    //id: integer().primaryKey().generatedAlwaysAsIdentity(),
    channelId: uuid().primaryKey().unique().notNull().$default(() => crypto.randomUUID()),
    serverId: uuid().notNull().references(() => serversTable.serverId),
    name: varchar({ length: 255 }).notNull()
});

export const messagesTable = pgTable('messages', {
    //id: integer().primaryKey().generatedAlwaysAsIdentity(),
    messageId: uuid().primaryKey().unique().notNull().$default(() => crypto.randomUUID()),
    userId: uuid().notNull().references(() => usersTable.userId),
    channelId: uuid().notNull().references(() => channelsTable.channelId, { onDelete: 'cascade' }),
    serverId: uuid().notNull().references(() => serversTable.serverId),
    content: varchar({ length: 2047 }).notNull(),
    date: timestamp().notNull().defaultNow(),
    hasFiles: boolean().notNull().default(false)
})

export const filesTable = pgTable('files', {
    fileId: uuid().primaryKey().unique().notNull().$default(() => crypto.randomUUID()),
    messageId: uuid().notNull().references(() => messagesTable.messageId, { onDelete: 'cascade' }),
    serverId: uuid().notNull().references(() => serversTable.serverId),
    name: varchar({ length: 255 }).notNull(),
    mimeType: varchar({ length: 255 }).notNull()
});