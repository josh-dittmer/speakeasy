import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { createChannel, getChannelData, Tags } from '../api/requests';
import { CreateChannelRequestT } from 'models';
import { useRouter } from 'next/navigation';
import { getChannelDataKey } from '../queries/get_channel_data';
import { getServerDataKey } from '../queries/get_server_data';

export const createChannelKey = (serverId: string): string => `createChannel_${serverId}`;

type CreateChannelMutationVars = {
    name: string
};

export const createChannelMutation = (serverId: string, clientId: string) => {
    const router = useRouter();
    const client = useQueryClient();

    return useMutation({
        mutationFn: (vars: CreateChannelMutationVars) => createChannel({
            serverId: serverId,
            name: vars.name,
            clientId: clientId
        }),
        mutationKey: [createChannelKey(serverId)],
        onSuccess: (data, variables, context) => {
            client.invalidateQueries({ queryKey: [Tags.serverData, getServerDataKey(serverId)] });
            router.push(`/home/${data.serverId}/${data.channelId}`);
        }
    })
}