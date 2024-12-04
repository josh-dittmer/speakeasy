import { QueryClient, useMutation } from '@tanstack/react-query';
import { editProfile, Tags } from '../api/requests';
import { useUploadFileMutation } from './upload_file';

export const editProfileKey = (): string => `editProfile`;

type EditProfileMutationVars = {
    name: string;
    bio: string;
    imageFile: File | null;
};

export const useEditProfileMutation = (client: QueryClient, clientId: string) => {
    const { mutate } = useUploadFileMutation(client);

    return useMutation({
        mutationFn: (vars: EditProfileMutationVars) =>
            editProfile({
                name: vars.name,
                bio: vars.bio,
                image: vars.imageFile
                    ? {
                        name: vars.imageFile.name,
                        mimeType: vars.imageFile.type,
                    }
                    : null,
                clientId: clientId,
            }),
        mutationKey: [editProfileKey()],
        onSuccess: (data, variables) => {
            client.invalidateQueries({ queryKey: [Tags.myself] });
            client.invalidateQueries({ queryKey: [Tags.serverData] });
            client.invalidateQueries({ queryKey: [Tags.channelData] });
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
