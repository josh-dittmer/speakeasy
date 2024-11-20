'use client';

import ChatArea from '@/components/chat_area/chat_area';
import { getServerData } from '@/lib/api/requests'
import { getServerDataQuery } from '@/lib/queries/get_server_data';
import { ServerDataT } from 'models'

export default function ChannelPage({ params }: Readonly<{ params: { serverId: string, channelId: string } }>) {    
    const { data } = getServerDataQuery(params.serverId);

    if (!data) return;

    return (
        <>
            <ChatArea channelId={params.channelId} users={data.users} />
        </>
    )
}