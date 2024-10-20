import { db } from './db';
import { membershipsTable, serversTable, usersTable } from './schema';

async function seed() {
    try {
        console.log('Seeding...');

        await db.delete(serversTable);
        await db.delete(usersTable);
        await db.delete(membershipsTable);

        console.log('Cleared database. Inserting...');

        const server1Id = crypto.randomUUID();
        const server2Id = crypto.randomUUID();
        const server3Id = crypto.randomUUID();

        const user1Id = 'b01c318d-a6d4-42ef-bd5c-92b777e357ad';
        const user2Id = crypto.randomUUID();
        const user3Id = crypto.randomUUID();

        const servers: Array<typeof serversTable.$inferInsert> = [
            {
                name: 'Test Server 1',
                serverId: server1Id,
                imageId: crypto.randomUUID()
            },
            {
                name: 'Test Server 2',
                serverId: server2Id,
                imageId: crypto.randomUUID()
            },
            {
                name: 'Test Server 3',
                serverId: server3Id,
                imageId: crypto.randomUUID()
            }
        ];

        const users: Array<typeof usersTable.$inferInsert> = [
            {
                name: 'Test User 1',
                bio: 'I am test user #1',
                userId: user1Id,
                imageId: crypto.randomUUID()
            },
            {
                name: 'Test User 2',
                bio: 'I am test user #2',
                userId: user2Id,
                imageId: crypto.randomUUID()
            },
            {
                name: 'Test User 3',
                userId: user3Id,
                imageId: crypto.randomUUID()
            }
        ];

        const memberships: Array<typeof membershipsTable.$inferInsert> = [
            {
                serverId: server1Id,
                userId: user1Id,
            },
            {
                serverId: server1Id,
                userId: user2Id,
            },
            {
                serverId: server1Id,
                userId: user3Id,
            },
            {
                serverId: server2Id,
                userId: user1Id,
            },
            {
                serverId: server2Id,
                userId: user3Id,
            },
            {
                serverId: server3Id,
                userId: user3Id,
            },
        ];

        await db.insert(serversTable).values(servers);
        await db.insert(usersTable).values(users);
        await db.insert(membershipsTable).values(memberships);

        console.log('Finished seeding.');
    } catch(err) {
        console.log(`Error: ${err}`);
        throw new Error('Seeding failed');
    }
}

seed();