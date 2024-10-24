import { getServerData, getServerList } from '@/lib/api/requests';
import { ServerArrayT, ServerDataT } from 'models';
import { redirect } from 'next/navigation';

export default async function ServerPage({ params }: { params: { serverId: string }}) {
    const serverData: ServerDataT = await getServerData(params.serverId);

    // TODO: Load last visited channel from local storage
    const lastChannel = serverData.channels[0];

    if (lastChannel) {
        redirect(`/home/${params.serverId}/${lastChannel.channelId}`);
    }

    return <></>
}