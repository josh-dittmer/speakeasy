import { useQuery } from '@tanstack/react-query';
import { getServerData, Tags } from '../api/requests';

export const getServerDataKey = (serverId: string) => `getServerData_${serverId}`;

export const useGetServerDataQuery = (serverId: string) =>
    useQuery({
        queryKey: [Tags.serverData, getServerDataKey(serverId!)],
        queryFn: () => getServerData(serverId!),
        staleTime: Infinity,
    });

export const useGetServerDataQueryDependent = (serverId: string | undefined) =>
    useQuery({
        queryKey: [Tags.serverData],
        queryFn: () => getServerData(serverId!),
        staleTime: Infinity,
        enabled: !!serverId,
    });
