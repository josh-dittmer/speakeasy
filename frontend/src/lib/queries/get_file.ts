import { useQuery } from '@tanstack/react-query';
import { endpoints } from '../api/endpoints';

export const getFileKey = (fileId: string): string => `getFile_${fileId}`;

const downloadFile = async (fileLocation: string, fileId: string): Promise<Blob> => {
    const res = await fetch(`${endpoints.MAIN_API}/getFile/${fileLocation}/${fileId}`)
    if (res.status !== 200) throw new Error('failed to download file');

    return res.blob();
};

export const getFileQuery = (fileLocation: string, fileId: string) => useQuery({
    queryKey: [getFileKey(fileId)],
    queryFn: () => downloadFile(fileLocation, fileId),
    staleTime: Infinity
});