'use client';

import ChannelBar from "@/components/channel_bar/channel_bar";
import UserBar from "@/components/user_bar/user_bar";
import { getServerData } from "@/lib/api/requests"
import { getServerDataQuery } from "@/lib/queries/get_server_data";
import { ServerDataT } from "models"

export default function ServerLayout({ params, children }: Readonly<{ params: { serverId: string }, children: React.ReactNode }>) {
    const { data } = getServerDataQuery(params.serverId);

    if (!data) return;

    return (
        <>
            <ChannelBar channels={data.channels} server={data.server} />
            {children}
            <UserBar users={data.users} />
        </>
    )
}