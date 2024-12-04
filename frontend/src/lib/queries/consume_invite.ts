import { useQuery } from '@tanstack/react-query';
import { consumeInvite } from '../api/requests';

export const consumeInviteKey = (inviteId: string) => `consumeInvite_${inviteId}`;

export const useConsumeInviteQuery = (inviteId: string, clientId: string) =>
    useQuery({
        queryKey: [consumeInviteKey(inviteId)],
        queryFn: () => consumeInvite(inviteId, clientId),
        staleTime: Infinity,
        retry: false
    });
