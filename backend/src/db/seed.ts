import { db } from './db';
import { channelsTable, membershipsTable, serversTable, usersTable } from './schema';

async function seed() {
    try {
        console.log('Seeding...');

        await db.delete(serversTable);
        await db.delete(usersTable);
        await db.delete(membershipsTable);
        await db.delete(channelsTable);

        console.log('Cleared database. Inserting...');

        const server1Id = '045a66e6-30cb-4d05-916e-4debe61b9413';
        const server2Id = crypto.randomUUID();
        const server3Id = crypto.randomUUID();

        const user1Id = 'b01c318d-a6d4-42ef-bd5c-92b777e357ad';
        const user2Id = crypto.randomUUID();
        const user3Id = crypto.randomUUID();

        const s1channel1Id = crypto.randomUUID();
        const s1channel2Id = crypto.randomUUID();
        const s2channel1Id = crypto.randomUUID();
        const s3channel1Id = crypto.randomUUID();

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
                imageId: crypto.randomUUID(),
                lastVisitedServer: server2Id
            },
            {
                name: 'Test User 2',
                bio: 'I am test user #2',
                userId: user2Id,
                imageId: crypto.randomUUID(),
                lastVisitedServer: server2Id,
            },
            {
                name: 'Test User 3',
                userId: user3Id,
                imageId: crypto.randomUUID(),
                lastVisitedServer: server3Id
            }
        ];

        const memberships: Array<typeof membershipsTable.$inferInsert> = [
            {
                serverId: server1Id,
                userId: user1Id,
                lastVisitedChannel: s1channel2Id
            },
            {
                serverId: server1Id,
                userId: user2Id,
                lastVisitedChannel: s1channel2Id
            },
            {
                serverId: server1Id,
                userId: user3Id,
                lastVisitedChannel: s1channel2Id
            },
            {
                serverId: server2Id,
                userId: user1Id,
                lastVisitedChannel: s2channel1Id
            },
            {
                serverId: server2Id,
                userId: user3Id,
                lastVisitedChannel: s2channel1Id
            },
            {
                serverId: server3Id,
                userId: user3Id,
                lastVisitedChannel: s3channel1Id
            },
        ];

        const channels: Array<typeof channelsTable.$inferInsert> = [
            {
                channelId: s1channel1Id,
                serverId: server1Id,
                name: 'S1 Channel 1'
            },
            {
                channelId: s1channel2Id,
                serverId: server1Id,
                name: 'S1 Channel 2'
            },
            {
                channelId: s2channel1Id,
                serverId: server2Id,
                name: 'S2 Channel 1'
            },
            {
                channelId: s3channel1Id,
                serverId: server3Id,
                name: 'S3 Channel 1'
            },
        ]

        await db.insert(serversTable).values(servers);
        await db.insert(usersTable).values(users);
        await db.insert(membershipsTable).values(memberships);
        await db.insert(channelsTable).values(channels);

        console.log('Finished seeding.');
    } catch(err) {
        console.log(`Error: ${err}`);
        throw new Error('Seeding failed');
    }
}

seed();