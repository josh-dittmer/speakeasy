'use client';

import { useGetServerDataQueryDependent } from '@/lib/queries/get_server_data';
import { useGetServerListQuery } from '@/lib/queries/get_server_list';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
    const router = useRouter();

    const { data: servers } = useGetServerListQuery();
    const lastServer = servers?.at(0);

    const { data: serverData, isSuccess: serverLoadFinished } = useGetServerDataQueryDependent(
        lastServer?.serverId,
    );
    const lastChannel = serverData?.channels[0];

    useEffect(() => {
        if (lastServer && serverLoadFinished) {
            router.push(
                lastChannel
                    ? `/home/${lastServer.serverId}/${lastChannel.channelId}`
                    : `/home/${lastServer.serverId}/empty`,
            );
        }
    }, [router, lastServer, lastChannel, serverLoadFinished]);

    return <></>;
}
