import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { EditChannelRequestT } from 'models';
import { editChannel } from '../api/requests';
import { useRouter } from 'next/navigation';
import { getChannelDataKey } from '../queries/get_channel_data';

export const editChannelKey = (channelId: string): string => `editChannel_${channelId}`;

export const editChannelMutation = (client: QueryClient, channelId: string) => {
    const router = useRouter();

    return useMutation({
        mutationFn: (vars: EditChannelRequestT) => editChannel(channelId, vars),
        mutationKey: [editChannelKey(channelId)],
        onSuccess: () => {
            client.invalidateQueries({ queryKey: [getChannelDataKey(channelId)] });
            router.refresh();
        }
    })
}