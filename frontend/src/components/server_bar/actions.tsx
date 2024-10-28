'use server'

import { getServerData } from '@/lib/api/requests';
import { ServerDataT } from 'models';
import { redirect } from 'next/navigation';

 
export async function visitServer(serverId: string) {
    const serverData: ServerDataT = await getServerData(serverId);
    // TODO: load last channel from local storage
    const lastChannel = serverData.channels[0];

    redirect(`/home/${serverId}/${lastChannel.channelId}`);
}