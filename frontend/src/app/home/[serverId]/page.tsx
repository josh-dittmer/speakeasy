import { endpoints } from '@/lib/endpoints';
import { GetLastVisitedChannelReqT, LastVisitedChannel, LastVisitedChannelT } from 'models';
import { isLeft } from 'fp-ts/Either'
import { redirect } from 'next/navigation'
import { getLastVisitedChannel } from '@/lib/requests';

export default async function ServerPage({ params }: { params: { serverId: string }}) {
    const lastVisitedChannel: LastVisitedChannelT = await getLastVisitedChannel(params.serverId);
    redirect(`/home/${params.serverId}/${lastVisitedChannel.channelId}`);
}