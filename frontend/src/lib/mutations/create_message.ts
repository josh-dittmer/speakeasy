import { QueryClient, useMutation, useMutationState } from '@tanstack/react-query';
import { CreateMessageRequestT } from 'models';
import { createMessage, Tags } from '../api/requests';
import { getChannelDataKey } from '../queries/get_channel_data';
import { useUploadFileMutation } from './upload_file';

export const createMessageKey = (channelId: string): string => `createMessage_${channelId}`;

type CreateMessageMutationVars = {
    content: string;
    files: Array<File>;
};

export const useCreateMessageMutation = (client: QueryClient, channelId: string, clientId: string) => {
    const { mutate } = useUploadFileMutation(client);

    return useMutation({
        mutationFn: (vars: CreateMessageMutationVars) =>
            createMessage({
                channelId: channelId,
                content: vars.content,
                files: vars.files.map(file => ({
                    name: file.name,
                    mimeType: file.type,
                })),
                clientId: clientId,
            }),
        onSettled: () =>
            client.invalidateQueries({
                queryKey: [Tags.channelData, getChannelDataKey(channelId)],
            }),
        mutationKey: [createMessageKey(channelId)],
        onSuccess: (data, variables) => {
            const filesMap = new Map<string, File>();
            variables.files.forEach(file => {
                filesMap.set(file.name, file);
            });

            // upload files
            data.uploads?.forEach(upload => {
                const file = filesMap.get(upload.name);
                if (!file) return;

                mutate({
                    url: upload.url,
                    file: file,
                    fileId: upload.fileId,
                    fields: upload.fields,
                    finishedCallback: () => { },
                });
            });
        },
        onError: (error) => {
            console.log(error);
        },
    });
};

export const usePendingMessageState = (channelId: string) =>
    useMutationState({
        filters: {
            mutationKey: [createMessageKey(channelId)],
            status: 'pending',
        },
        select: mutation => mutation.state.variables as CreateMessageRequestT,
    });

export const useFailedMessageState = (channelId: string) =>
    useMutationState({
        filters: {
            mutationKey: [createMessageKey(channelId)],
            status: 'error',
        },
        select: mutation => mutation.state.variables as CreateMessageRequestT,
    });
