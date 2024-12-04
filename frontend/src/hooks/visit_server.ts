import { useGetServerDataQuery } from '@/lib/queries/get_server_data';
import { useRouter } from 'next/navigation';

const useVisitServer = (serverId: string) => {
    const { data, isSuccess } = useGetServerDataQuery(serverId);
    const router = useRouter();

    return {
        finished: isSuccess,
        visitServer: () => {
            if (data) {
                const lastChannel = data.channels[0];
                router.push(
                    lastChannel
                        ? `/home/${data.server.serverId}/${lastChannel.channelId}`
                        : `/home/${data.server.serverId}/empty`,
                );
            }
        }
    }
}

export default useVisitServer;