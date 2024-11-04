import { useMutation } from '@tanstack/react-query';
import { createChannel } from '../api/requests';
import { CreateChannelRequestT } from 'models';
import { useRouter } from 'next/navigation';

export const createChannelKey = (serverId: string): string => `createChannel_${serverId}`;

type CreateChannelMutationVars = {
    name: string
};

export const createChannelMutation = (serverId: string) => {
    const router = useRouter();

    return useMutation({
        mutationFn: (vars: CreateChannelMutationVars) => createChannel({
            serverId: serverId,
            name: vars.name
        }),
        mutationKey: [createChannelKey(serverId)],
        onSuccess: (data, variables, context) => {
            router.push(`/home/${data.serverId}/${data.channelId}`);
        }
    })
}