import { QueryClient, useMutation } from '@tanstack/react-query';
import { editServer, Tags } from '../api/requests';
import { getServerDataKey } from '../queries/get_server_data';
import { getServerListKey } from '../queries/get_server_list';
import { useUploadFileMutation } from './upload_file';

export const editServerKey = (serverId: string): string => `editServer_${serverId}`;

type EditServerMutationVars = {
    name: string;
    imageFile: File | null;
};

export const useEditServerMutation = (client: QueryClient, serverId: string, clientId: string) => {
    const { mutate } = useUploadFileMutation(client);

    return useMutation({
        mutationFn: (vars: EditServerMutationVars) =>
            editServer(serverId, {
                name: vars.name,
                image: vars.imageFile
                    ? {
                        name: vars.imageFile.name,
                        mimeType: vars.imageFile.type,
                    }
                    : null,
                clientId: clientId,
            }),
        mutationKey: [editServerKey(serverId)],
        onSuccess: (data, variables) => {
            client.invalidateQueries({ queryKey: [getServerListKey()] });
            client.invalidateQueries({ queryKey: [Tags.serverData, getServerDataKey(serverId)] });
            if (data.upload && variables.imageFile) {
                mutate({
                    url: data.upload.url,
                    file: variables.imageFile,
                    fileId: data.upload.fileId,
                    fields: data.upload.fields,
                    finishedCallback: () => {
                        //router.refresh();
                    },
                });
            }
        },
        onError: (error) => {
            console.log(error);
        },
    });
};
