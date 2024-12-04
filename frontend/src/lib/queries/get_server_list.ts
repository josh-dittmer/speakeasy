import { useQuery } from '@tanstack/react-query';
import { getServerList } from '../api/requests';

export const getServerListKey = () => 'getServerList';

export const useGetServerListQuery = () =>
    useQuery({
        queryKey: [getServerListKey()],
        queryFn: () => getServerList(),
        staleTime: Infinity,
    });
