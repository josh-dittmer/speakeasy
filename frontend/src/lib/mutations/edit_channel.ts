import { QueryClient, useMutation } from '@tanstack/react-query';
import { EditChannelRequestT } from 'models';
import { editChannel, Tags } from '../api/requests';
import { getChannelDataKey } from '../queries/get_channel_data';
import { getServerDataKey } from '../queries/get_server_data';

export const editChannelKey = (channelId: string): string => `editChannel_${channelId}`;

export const useEditChannelMutation = (client: QueryClient, serverId: string, channelId: string) => {
    return useMutation({
        mutationFn: (vars: EditChannelRequestT) => editChannel(channelId, vars),
        mutationKey: [editChannelKey(channelId)],
        onSuccess: () => {
            client.invalidateQueries({
                queryKey: [Tags.channelData, getChannelDataKey(channelId)],
            });
            client.invalidateQueries({ queryKey: [Tags.serverData, getServerDataKey(serverId)] });
            //router.refresh();
        },
    });
};
