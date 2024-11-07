import { QueryClient, useMutation } from '@tanstack/react-query';
import { uploadFile } from '../api/requests';
import { getFileKey } from '../queries/get_file';
import { useRouter } from 'next/navigation';

export const uploadFileKey = 'uploadFile';

type UploadFileMutationVars = {
    url: string, 
    file: File, 
    fileId: string,
    fields: unknown,
    finishedCallback: () => void
}

export const uploadFileMutation = (client: QueryClient) => {
    return useMutation({
        mutationFn: (vars: UploadFileMutationVars) => uploadFile({
            uploadUrl: vars.url,
            file: vars.file,
            fields: vars.fields
        }),
        onSettled: (data, err, variables, context) => {
            console.log('test');
            variables.finishedCallback();
            client.invalidateQueries({ queryKey: [getFileKey(variables.fileId)] });
        },
        mutationKey: [uploadFileKey],
        onSuccess: (data, variables, context) => {
            console.log('testing 123');
        }
    })
}