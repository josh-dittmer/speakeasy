import { getChannelData, Tags } from '@/lib/api/requests';
import { useInfiniteQuery } from '@tanstack/react-query';

export const getChannelDataKey = (channelId: string): string => `getChannelData_${channelId}`;

const fetchMessages =
    (channelId: string) =>
        async ({ pageParam }: { pageParam: number }) =>
            await getChannelData(channelId, pageParam);

export const useGetChannelDataQuery = (channelId: string) =>
    useInfiniteQuery({
        queryKey: [Tags.channelData, getChannelDataKey(channelId)],
        queryFn: fetchMessages(channelId),
        select: data => ({
            //pages: [...data.pages].reverse(),
            //pageParams: [...data.pageParams].reverse(),
            pages: [...data.pages].reverse(),
            pageParams: [...data.pageParams].reverse(),
        }),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
            if (lastPage.messages.length === 0) return undefined;
            return lastPageParam + 1;
        },
        getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
            if (firstPageParam <= 1) return undefined;
            return firstPageParam - 1;
        },
    });
