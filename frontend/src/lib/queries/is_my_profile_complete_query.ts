import { useQuery } from '@tanstack/react-query';
import { isMyProfileComplete } from '../api/requests';

export const useIsMyProfileCompleteQuery = () =>
    useQuery({
        queryKey: ['isMyProfileComplete'],
        queryFn: () => isMyProfileComplete(),
    });
