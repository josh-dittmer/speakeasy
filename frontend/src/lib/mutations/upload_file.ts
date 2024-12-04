import { QueryClient, useMutation } from '@tanstack/react-query';
import { uploadFile } from '../api/requests';
import { getFileKey } from '../queries/get_file';

export const uploadFileKey = 'uploadFile';

type UploadFileMutationVars = {
    url: string;
    file: File;
    fileId: string;
    fields: unknown;
    finishedCallback: () => void;
};

export const useUploadFileMutation = (client: QueryClient) => {
    return useMutation({
        mutationFn: (vars: UploadFileMutationVars) =>
            uploadFile({
                uploadUrl: vars.url,
                file: vars.file,
                fields: vars.fields,
            }),
        onSettled: (data, err, variables) => {
            variables.finishedCallback();
            client.invalidateQueries({ queryKey: [getFileKey(variables.fileId)] });
        },
        mutationKey: [uploadFileKey],
    });
};
