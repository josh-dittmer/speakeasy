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
    bio: varchar({ length: 511 })
});

export const membershipsTable = pgTable('memberships', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    serverId: uuid().notNull(),
    userId: uuid().notNull()
});