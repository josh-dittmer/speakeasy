import ChatArea from '@/components/chat_area/chat_area';

export default function ChannelPage({
    params,
}: Readonly<{ params: { serverId: string; channelId: string } }>) {
    return <ChatArea serverId={params.serverId} channelId={params.channelId} />;
}
