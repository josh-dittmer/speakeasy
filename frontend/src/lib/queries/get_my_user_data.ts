import { useQuery } from '@tanstack/react-query';
import { getMyUserData, Tags } from '../api/requests';

export const useGetMyUserDataQuery = () =>
    useQuery({
        queryKey: [Tags.myself],
        queryFn: () => getMyUserData(),
        staleTime: Infinity,
    });
