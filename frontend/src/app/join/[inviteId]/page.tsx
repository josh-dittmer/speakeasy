'use client';

import useVisitServer from "@/hooks/visit_server";
import { useConsumeInviteQuery } from "@/lib/queries/consume_invite";
import { ConsumeInviteResponseT } from "models";
import Image from "next/image";
import { useEffect } from "react";

function PostJoinInfo({ response }: { response: ConsumeInviteResponseT }) {
    const { finished, visitServer } = useVisitServer(response.serverId);

    useEffect(() => {
        if (finished && (response.success || response.joined)) {
            visitServer();
        }
    }, [response, finished, visitServer]);

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
    const { data, isPending, isError } = useConsumeInviteQuery(params.inviteId);

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center">
            {isPending && (
                <>
                    <Image
                        src={'/img/image_loading.gif'}
                        width={64}
                        height={64}
                        //sizes="100vw"
                        //className="w-16 h-16"
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