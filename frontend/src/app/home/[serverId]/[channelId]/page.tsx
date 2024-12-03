import ChatArea from '@/components/chat_area/chat_area';
import { getServerData } from '@/lib/api/requests'
import { getServerDataQuery } from '@/lib/queries/get_server_data';
import { ServerDataT } from 'models'

export default function ChannelPage({ params }: Readonly<{ params: { serverId: string, channelId: string } }>) {    
    return <ChatArea serverId={params.serverId} channelId={params.channelId} />
}