import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createChannel, Tags } from '../api/requests';
import { getServerDataKey } from '../queries/get_server_data';

export const createChannelKey = (serverId: string): string => `createChannel_${serverId}`;

type CreateChannelMutationVars = {
    name: string;
};

export const useCreateChannelMutation = (serverId: string, clientId: string) => {
    const router = useRouter();
    const client = useQueryClient();

    return useMutation({
        mutationFn: (vars: CreateChannelMutationVars) =>
            createChannel({
                serverId: serverId,
                name: vars.name,
                clientId: clientId,
            }),
        mutationKey: [createChannelKey(serverId)],
        onSuccess: (data) => {
            client.invalidateQueries({ queryKey: [Tags.serverData, getServerDataKey(serverId)] });
            router.push(`/home/${data.serverId}/${data.channelId}`);
        },
    });
};
