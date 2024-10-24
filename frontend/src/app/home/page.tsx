import { getServerData, getServerList } from '@/lib/api/requests';
import { ChannelArrayT, ServerArrayT, ServerDataT } from 'models';
import { redirect } from 'next/navigation';

export default async function HomePage() {
    const servers: ServerArrayT = await getServerList();

    // TODO: Load last visited server from local storage
    const lastServer = servers[0];

    if (lastServer) {
        redirect(`/home/${lastServer.serverId}/`);
    }

    return <></>
}