'use client';

import useVisitServer from "@/hooks/visit_server";
import { useConsumeInviteQuery } from "@/lib/queries/consume_invite";
import { getServerListKey } from "@/lib/queries/get_server_list";
import { CLIENT_ID } from "@/lib/util/client_id";
import { useQueryClient } from "@tanstack/react-query";
import { ConsumeInviteResponseT } from "models";
import Image from "next/image";
import { useEffect } from "react";

function PostJoinInfo({ response }: { response: ConsumeInviteResponseT }) {
    const { finished, visitServer } = useVisitServer(response.serverId);
    const client = useQueryClient();

    useEffect(() => {
        if (finished && (response.success || response.joined)) {
            client.invalidateQueries({ queryKey: [getServerListKey()] });
            visitServer();
        }
    }, [response, finished, visitServer, client]);

    const expired = response.expiresAt && Date.now() >= response.expiresAt;

    return (
        <>
            {!response.success && expired && (
                <p className="text-fg-dark">This invite has expired!</p>
            )}
        </>
    )
}

export default function JoinPage({ params }: { params: { inviteId: string } }) {
    const { data, isPending, isError } = useConsumeInviteQuery(params.inviteId, CLIENT_ID);

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center">
            {isPending && (
                <>
                    <Image
                        src={'/img/image_loading.gif'}
                        width={64}
                        height={64}
                        alt="Loading"
                    />
                    <p className="text-fg-dark">Joining server...</p>
                </>
            )}
            {data && (
                <PostJoinInfo response={data} />
            )}
            {isError && (
                <p className="text-fg-dark">Something went wrong :(</p>
            )}
        </div>
    )
}