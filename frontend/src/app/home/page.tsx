import { getServerData, getServerList } from '@/lib/api/requests';
import { ServerArrayT, ServerDataT } from 'models';
import { redirect } from 'next/navigation';

export default async function HomePage() {
    const servers: ServerArrayT = await getServerList();

    // TODO: Load last visited server from local storage
    const lastServer = servers[0];

    const serverData: ServerDataT = await getServerData(lastServer.serverId);

    // TODO: Load last visited channel from local storage
    const lastChannel = serverData.channels[0];

    if (lastServer) {
        redirect((lastChannel) ? `/home/${lastServer.serverId}/${lastChannel.channelId}` : `/home/${lastServer.serverId}/empty`);
    }

    return <></>
}