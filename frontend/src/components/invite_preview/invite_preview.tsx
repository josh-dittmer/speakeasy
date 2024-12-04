import useVisitServer from "@/hooks/visit_server";
import { consumeInviteKey } from "@/lib/queries/consume_invite";
import { usePreviewInviteQuery } from "@/lib/queries/preview_invite_query";
import { formatDate } from "@/lib/util/date";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import ServerImage from "../server_image/server_image";
import { SubmitButton } from "../ui/forms/button/button";
import { NormalForm } from "../ui/forms/form/form";

function ServerLink({ serverName, serverId }: { serverName: string, serverId: string }) {
    const { visitServer } = useVisitServer(serverId);

    return (
        <button onClick={visitServer} className="hover:underline w-32 truncate">{serverName}</button>
    )
}

export default function InvitePreview({ inviteId }: { inviteId: string }) {
    const { data } = usePreviewInviteQuery(inviteId);

    const client = useQueryClient();
    const router = useRouter();

    const handleJoinServer = async () => {
        client.invalidateQueries({ queryKey: [consumeInviteKey(inviteId)], refetchType: 'all' });
        router.push(`/join/${inviteId}`);
    };

    if (!data) return;

    const expired: boolean = (data.expiresAt) ? Date.now() >= data.expiresAt : false;
    const buttonText = (expired) ? 'Expired' : (data.joined) ? 'Joined' : 'Accept';

    return (
        <div className="bg-bg-medium-dark p-3 rounded-xl shadow w-80">
            <p className="text-fg-dark text-sm"><span className="font-bold">{data.userName}</span> has invited you to join</p>
            <div className="flex items-center gap-3 pt-3">
                <div className="shrink-0">
                    <ServerImage serverName={data.serverName} imageId={data.serverImageId} />
                </div>
                <div className="text-fg-dark text-lg font-bold">
                    {!data.joined && (
                        <p className="w-32 truncate">{data.serverName}</p>
                    )}
                    {data.joined && (
                        <ServerLink serverName={data.serverName} serverId={data.serverId} />
                    )}
                </div>
                <div className="flex justify-end grow">
                    <NormalForm>
                        <SubmitButton onClick={handleJoinServer} text={buttonText} enabled={!expired && !data.joined} />
                    </NormalForm>
                </div>
            </div>
            <div className="pt-3">
                <p className="text-xs text-fg-light">
                    {data.expiresAt && (
                        <span>Invite expire{expired ? 'd' : 's'} <span className="font-bold">{formatDate(new Date(data.expiresAt))}</span></span>
                    )}
                    {!data.expiresAt && (
                        <span>Invite never expires</span>
                    )}
                </p>
            </div>
        </div>
    )
}