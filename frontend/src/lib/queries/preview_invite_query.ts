import { useQuery } from '@tanstack/react-query';
import { previewInvite } from '../api/requests';

export const previewInviteKey = (inviteId: string) => `previewInvite_${inviteId}`;

export const usePreviewInviteQuery = (inviteId: string) =>
    useQuery({
        queryKey: [previewInviteKey(inviteId)],
        queryFn: () => previewInvite(inviteId),
    });
