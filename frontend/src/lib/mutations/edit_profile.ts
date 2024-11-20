import { QueryClient, useMutation } from "@tanstack/react-query";
import { uploadFileMutation } from "./upload_file";
import { editProfile, editServer, Tags } from "../api/requests";
import { useRouter } from "next/navigation";

export const editProfileKey = (): string => `editProfile`;

type EditProfileMutationVars = {
    name: string,
    bio: string,
    imageFile: File | null
}

export const editProfileMutation = (client: QueryClient) => {
    const { mutate } = uploadFileMutation(client);
    const router = useRouter();

    return useMutation({
        mutationFn: (vars: EditProfileMutationVars) => editProfile({
            name: vars.name,
            bio: vars.bio,
            image: (vars.imageFile) ? {
                name: vars.imageFile.name,
                mimeType: vars.imageFile.type
            } : null
        }),
        mutationKey: [editProfileKey()],
        onSuccess: (data, variables, context) => {
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
                    }
                });
            }
        },
        onError: (error, variables, context) => {
            console.log(error)
        }
    })
}