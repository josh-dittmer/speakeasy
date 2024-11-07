import { QueryClient, useMutation } from "@tanstack/react-query";
import { uploadFileMutation } from "./upload_file";
import { editServer } from "../api/requests";
import { useRouter } from "next/navigation";

export const editServerKey = (serverId: string): string => `editServer_${serverId}`;

type EditServerMutationVars = {
    name: string,
    imageFile: File | null
}

export const editServerMutation = (client: QueryClient, serverId: string) => {
    const { mutate } = uploadFileMutation(client);
    const router = useRouter();

    return useMutation({
        mutationFn: (vars: EditServerMutationVars) => editServer(serverId, {
            name: vars.name,
            image: (vars.imageFile) ? {
                name: vars.imageFile.name,
                mimeType: vars.imageFile.type
            } : null
        }),
        mutationKey: [editServerKey(serverId)],
        onSuccess: (data, variables, context) => {
            if (data.upload && variables.imageFile) {
                mutate({
                    url: data.upload.url,
                    file: variables.imageFile,
                    fileId: data.upload.fileId,
                    fields: data.upload.fields,
                    finishedCallback: () => {
                        router.refresh();
                    }
                });
            }
        },
        onError: (error, variables, context) => {
            console.log(error)
        }
    })
}