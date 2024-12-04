import { useMutation } from '@tanstack/react-query';
import { createInvite } from '../api/requests';

export const createInviteKey = (serverId: string): string => `createInvite_${serverId}`;

type CreateInviteMutationVars = {
    validFor: number | null;
    callbackFn: (inviteId: string) => void;
};

export const useCreateInviteMutation = (serverId: string) =>
    useMutation({
        mutationFn: (vars: CreateInviteMutationVars) =>
            createInvite({
                serverId: serverId,
                validFor: vars.validFor,
            }),
        mutationKey: [createInviteKey(serverId)],
        onSuccess: (data, variables) => {
            variables.callbackFn(data.inviteId);
        },
    });
