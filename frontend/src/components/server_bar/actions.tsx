'use server'

import { getServerData, Tags } from '@/lib/api/requests';
import { ServerDataT } from 'models';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

 
export async function visitServer(serverId: string) {
    const serverData: ServerDataT = await getServerData(serverId);
    // TODO: load last channel from local storage
    const lastChannel = serverData.channels[0];

    redirect((lastChannel) ? `/home/${serverId}/${lastChannel.channelId}` : `/home/${serverId}/empty`);
}

export async function invalidateServers() {
    revalidateTag(Tags.servers);
}