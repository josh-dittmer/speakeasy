import { QueryClient, useMutation } from '@tanstack/react-query';
import { uploadFileMutation } from './upload_file';
import { useRouter } from 'next/navigation';
import { createServer } from '../api/requests';
import { getServerListKey } from '../queries/get_server_list';

export const createServerKey = (): string => 'createServer';

type CreateServerMutationVars = {
    name: string,
    imageFile: File | null
}

export const createServerMutation = (client: QueryClient, clientId: string) => {
    const { mutate } = uploadFileMutation(client);
    const router = useRouter();

    return useMutation({
        mutationFn: (vars: CreateServerMutationVars) => createServer({
            name: vars.name,
            image: (vars.imageFile) ? {
                name: vars.imageFile.name,
                mimeType: vars.imageFile.type
            } : null,
            clientId: clientId
        }),
        mutationKey: [createServerKey()],
        onSuccess: (data, variables, context) => {
            client.invalidateQueries({ queryKey: [getServerListKey()] });
            if (data.upload && variables.imageFile) {
                mutate({
                    url: data.upload.url,
                    file: variables.imageFile,
                    fileId: data.upload.fileId,
                    fields: data.upload.fields,
                    finishedCallback: () => {
                        //router.refresh();
                    }
                })
            }
        }
    })
}