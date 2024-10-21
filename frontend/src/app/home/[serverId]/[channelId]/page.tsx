import ChannelBar from '@/components/channel_bar';
import UserBar from '@/components/user_bar';
import { getChannelList } from '@/lib/requests';


export default async function ChannelPage({ params }: { params: { serverId: string, channelId: string }}) {
    const channels = await getChannelList(params.serverId);
    
    return (
        <>
            <div>
                <ChannelBar channels={channels} selectedChannelId={params.channelId} />
            </div>
            <div>
                <UserBar />
            </div>
        </>
    )
}