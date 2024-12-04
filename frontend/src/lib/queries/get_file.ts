import { useQuery } from '@tanstack/react-query';
import { downloadFile } from '../api/requests';

export const getFileKey = (fileId: string): string => `getFile_${fileId}`;

export const useGetFileQuery = (fileLocation: string, fileId: string) =>
    useQuery({
        queryKey: [getFileKey(fileId)],
        queryFn: () => downloadFile(fileLocation, fileId),
        staleTime: Infinity,
    });
