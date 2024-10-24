import ChatArea from '@/components/chat_area/chat_area';
import { getServerData } from '@/lib/api/requests'
import { ServerDataT } from 'models'

export default async function ChannelPage({ params }: Readonly<{ params: { serverId: string, channelId: string } }>) {
    const serverData: ServerDataT = await getServerData(params.serverId);

    return (
        <>
            <ChatArea channelId={params.channelId} users={serverData.users} />
        </>
    )
}