import { welcomeServerId } from 'models';
import { db } from './db';
import {
    channelsTable,
    filesTable,
    invitesTable,
    membershipsTable,
    messagesTable,
    serversTable,
    usersTable,
} from './schema';

/*async function seedTest() {
    try {
        console.log('Seeding...');

        await db.delete(filesTable);
        await db.delete(messagesTable);
        await db.delete(membershipsTable);
        await db.delete(channelsTable);
        await db.delete(serversTable);
        await db.delete(usersTable);

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

        const s1c1message1Id = crypto.randomUUID();
        const s1c1message2Id = crypto.randomUUID();
        const s1c1message3Id = crypto.randomUUID();
        const s1c2message1Id = crypto.randomUUID();
        const s1c2message2Id = crypto.randomUUID();
        const s1c2message3Id = crypto.randomUUID();

        const servers: Array<typeof serversTable.$inferInsert> = [
            {
                name: 'Test Server 1',
                serverId: server1Id,
                imageId: null
            },
            {
                name: 'Test Server 2',
                serverId: server2Id,
                imageId: null
            },
            {
                name: 'Test Server 3',
                serverId: server3Id,
                imageId: null
            }
        ];

        const users: Array<typeof usersTable.$inferInsert> = [
            {
                name: 'Test User 1',
                bio: 'I am test user #1',
                userId: user1Id,
                imageId: null,
            },
            {
                name: 'Test User 2',
                bio: 'I am test user #2',
                userId: user2Id,
                imageId: null,
            },
            {
                name: 'Test User 3',
                userId: user3Id,
                imageId: null,
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

        const messages: Array<typeof messagesTable.$inferInsert> = [
            {
                messageId: s1c1message1Id,
                userId: user1Id,
                channelId: s1channel1Id,
                serverId: server1Id,
                content: 'Test message #1 hello world'
            },
            {
                messageId: s1c1message2Id,
                userId: user2Id,
                channelId: s1channel1Id,
                serverId: server1Id,
                content: 'Testing #2'
            },
            {
                messageId: s1c1message3Id,
                userId: user3Id,
                channelId: s1channel1Id,
                serverId: server1Id,
                content: 'Number three test'
            },
            {
                messageId: s1c2message1Id,
                userId: user1Id,
                channelId: s1channel2Id,
                serverId: server1Id,
                content: 'Test'
            },
            {
                messageId: s1c2message2Id,
                userId: user1Id,
                channelId: s1channel2Id,
                serverId: server1Id,
                content: 'Testing'
            },
            {
                messageId: s1c2message3Id,
                userId: user1Id,
                channelId: s1channel2Id,
                serverId: server1Id,
                content: '123'
            }
        ]

        for (let i = 0; i < 25; i++) {
            messages.push({
                userId: user1Id,
                channelId: s1channel1Id,
                serverId: server1Id,
                content: `${i}`,
                //content: 'Extra long message to test formatting Extra long message to test formatting Extra long message to test formatting Extra long message to test formatting Extra long message to test formatting Extra long message to test formatting Extra long message to test formatting Extra long message to test formatting Extra long message to test formatting Extra long message to test formatting Extra long message to test formatting Extra long message to test formatting '
            });
        }

        await db.insert(serversTable).values(servers);
        await db.insert(usersTable).values(users);
        await db.insert(membershipsTable).values(memberships);
        await db.insert(channelsTable).values(channels);
        await db.insert(messagesTable).values(messages);

        console.log('Finished seeding.');
    } catch(err) {
        console.log(`Error: ${err}`);
        throw new Error('Seeding failed');
    }
}*/

async function seedProd() {
    try {
        console.log('Seeding...');

        await db.delete(invitesTable);
        await db.delete(filesTable);
        await db.delete(messagesTable);
        await db.delete(membershipsTable);
        await db.delete(channelsTable);
        await db.delete(serversTable);
        await db.delete(usersTable);

        console.log('Cleared database. Inserting...');

        const servers: Array<typeof serversTable.$inferInsert> = [
            {
                name: 'Welcome!',
                serverId: welcomeServerId,
                imageId: null,
            },
        ];

        const channels: Array<typeof channelsTable.$inferInsert> = [
            {
                channelId: crypto.randomUUID(),
                serverId: welcomeServerId,
                name: 'intro',
            },
            {
                channelId: crypto.randomUUID(),
                serverId: welcomeServerId,
                name: 'changelog',
            },
            {
                channelId: crypto.randomUUID(),
                serverId: welcomeServerId,
                name: 'general',
            },
        ];

        await db.insert(serversTable).values(servers);
        await db.insert(channelsTable).values(channels);

        console.log('Finished seeding.');
    } catch (err) {
        console.log(`Error: ${err}`);
        throw new Error('Seeding failed.');
    }
}

seedProd();
