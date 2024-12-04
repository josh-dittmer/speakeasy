import { QueryClient, useMutation } from '@tanstack/react-query';
import { createServer } from '../api/requests';
import { getServerListKey } from '../queries/get_server_list';
import { useUploadFileMutation } from './upload_file';

export const createServerKey = (): string => 'createServer';

type CreateServerMutationVars = {
    name: string;
    imageFile: File | null;
};

export const useCreateServerMutation = (client: QueryClient, clientId: string) => {
    const { mutate } = useUploadFileMutation(client);

    return useMutation({
        mutationFn: (vars: CreateServerMutationVars) =>
            createServer({
                name: vars.name,
                image: vars.imageFile
                    ? {
                        name: vars.imageFile.name,
                        mimeType: vars.imageFile.type,
                    }
                    : null,
                clientId: clientId,
            }),
        mutationKey: [createServerKey()],
        onSuccess: (data, variables) => {
            client.invalidateQueries({ queryKey: [getServerListKey()] });
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
    });
};
