'use client';

import { getServerData, getServerList } from '@/lib/api/requests';
import { ServerArrayT, ServerDataT } from 'models';
import { redirect, useRouter } from 'next/navigation';
import { getServerListQuery } from '@/lib/queries/get_server_list';
import { getServerDataQuery, getServerDataQueryDependent } from '@/lib/queries/get_server_data';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { isMyProfileCompleteQuery } from '@/lib/queries/is_my_profile_complete_query';

export default function HomePage() {
    const router = useRouter(); 

    const { data: servers } = getServerListQuery();
    const lastServer = servers?.at(0);

    const { data: serverData, isSuccess: serverLoadFinished } = getServerDataQueryDependent(lastServer?.serverId);
    const lastChannel = serverData?.channels[0];

    useEffect(() => {
        if (lastServer && serverLoadFinished) {
            router.push((lastChannel) ? `/home/${lastServer.serverId}/${lastChannel.channelId}` : `/home/${lastServer.serverId}/empty`);
        }
    }, [serverLoadFinished]);

    return <></>
}