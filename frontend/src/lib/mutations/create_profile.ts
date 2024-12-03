import { QueryClient, useMutation } from "@tanstack/react-query";
import { uploadFileMutation } from "./upload_file";
import { createProfile, editProfile, editServer, Tags } from "../api/requests";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { CLIENT_ID } from "../util/client_id";

export const createProfileKey = (): string => `createProfile`;

type CreateProfileMutationVars = {
    name: string,
    bio: string,
    imageFile: File | null
}

export const createProfileMutation = (client: QueryClient, redirectPath: string) => {
    const { mutate } = uploadFileMutation(client);
    const router = useRouter();

    return useMutation({
        mutationFn: (vars: CreateProfileMutationVars) => createProfile({
            name: vars.name,
            bio: vars.bio,
            image: (vars.imageFile) ? {
                name: vars.imageFile.name,
                mimeType: vars.imageFile.type
            } : null,
            clientId: CLIENT_ID
        }),
        mutationKey: [createProfileKey()],
        onSuccess: (data, variables, context) => {
            if (data.upload && variables.imageFile) {
                mutate({
                    url: data.upload.url,
                    file: variables.imageFile,
                    fileId: data.upload.fileId,
                    fields: data.upload.fields,
                    finishedCallback: () => {
                        router.push(redirectPath);
                    }
                });
            } else {
                router.push(redirectPath);
            }
        },
        onError: (error, variables, context) => {
            console.log(error)
        }
    })
}