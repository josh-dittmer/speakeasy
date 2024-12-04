import { QueryClient, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createProfile } from '../api/requests';
import { CLIENT_ID } from '../util/client_id';
import { useUploadFileMutation } from './upload_file';

export const createProfileKey = (): string => `createProfile`;

type CreateProfileMutationVars = {
    name: string;
    bio: string;
    imageFile: File | null;
};

export const useCreateProfileMutation = (client: QueryClient, redirectPath: string) => {
    const { mutate } = useUploadFileMutation(client);
    const router = useRouter();

    return useMutation({
        mutationFn: (vars: CreateProfileMutationVars) =>
            createProfile({
                name: vars.name,
                bio: vars.bio,
                image: vars.imageFile
                    ? {
                        name: vars.imageFile.name,
                        mimeType: vars.imageFile.type,
                    }
                    : null,
                clientId: CLIENT_ID,
            }),
        mutationKey: [createProfileKey()],
        onSuccess: (data, variables) => {
            if (data.upload && variables.imageFile) {
                mutate({
                    url: data.upload.url,
                    file: variables.imageFile,
                    fileId: data.upload.fileId,
                    fields: data.upload.fields,
                    finishedCallback: () => {
                        router.push(redirectPath);
                    },
                });
            } else {
                router.push(redirectPath);
            }
        },
        onError: (error) => {
            console.log(error);
        },
    });
};
