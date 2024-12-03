import { useQuery } from "@tanstack/react-query";
import { previewInvite } from "../api/requests";

export const previewInviteKey = (inviteId: string) => `previewInvite_${inviteId}`; 

export const previewInviteQuery = (inviteId: string) => useQuery({
    queryKey: [previewInviteKey(inviteId)],
    queryFn: () => previewInvite(inviteId),
});