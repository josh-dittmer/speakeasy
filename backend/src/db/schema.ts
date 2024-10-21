import { pgTable, integer, varchar, uuid } from 'drizzle-orm/pg-core';

export const serversTable = pgTable('servers', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    serverId: uuid().notNull().unique(),
    imageId: uuid(),
    name: varchar({ length: 255 }).notNull()
});

export const usersTable = pgTable('users', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: uuid().notNull().unique(),
    imageId: uuid(),
    name: varchar({ length: 255 }).notNull(),
    bio: varchar({ length: 511 }),
    lastVisitedServer: uuid().notNull()
});

export const membershipsTable = pgTable('memberships', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    serverId: uuid().notNull(),
    userId: uuid().notNull(),
    lastVisitedChannel: uuid().notNull()
});

export const channelsTable = pgTable('channels', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    channelId: uuid().notNull().unique(),
    serverId: uuid().notNull(),
    name: varchar({ length: 255 }).notNull()
});

// export const messagesTable = pgTable('messages', {...});