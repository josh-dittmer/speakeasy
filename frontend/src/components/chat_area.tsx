'use client';

import { getChannelData } from '@/lib/requests';
import { keepPreviousData, QueryClient, QueryClientProvider, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { MessageArrayT, MessageT, UserArrayT, UserT } from 'models';
import Image from 'next/image';
import { createRef, Fragment, useEffect, useRef, useState } from 'react';

const queryClient = new QueryClient();

function ChatMessage({ message, user } : { message: MessageT, user: UserT | undefined }) {
    return (
        <div className="flex ml-5 mb-5">
            <div className="shrink-0">
                <Image 
                    src={'/img/profile_pic.jpg'} 
                    width={50} 
                    height={50} 
                    alt="Profile picture" 
                    className="object-cover rounded-full"
                />
            </div>
            <div className="ml-3">
                <div className="flex items-center">
                    <p className="text-lg text-black">{user?.name}</p>
                    <p className="ml-3 text-xs text-gray-400">{message.date}</p>
                </div>
                <div className="">
                    <p className="text-md text-gray-600">{message.content}</p>
                </div>
            </div>
        </div>
    )
}

function ChatArea({ channelId, users }: { channelId: string, users: UserArrayT }) {
    const userMap = new Map<string, UserT>();
    users.map((user) => {
        userMap.set(user.userId, user);
    });

    const fetchMessages = async ({ pageParam }: { pageParam: any }) => await getChannelData(channelId, pageParam);
    const { data, error, fetchNextPage, isLoading } = useInfiniteQuery({
        queryKey: [channelId],
        queryFn: fetchMessages,
        select: (data) => ({
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
        //placeholderData: keepPreviousData
    });

    const onMessagesScrolled = (e: any) => {
        if (chatAreaRef.current?.scrollTop === 0) {
            fetchNextPage();
        } else if (chatAreaRef.current?.scrollTop === chatAreaRef?.current?.scrollHeight) {
            
        }
    };

    const chatAreaRef = createRef<HTMLDivElement>();
    const prevScrollHeightRef = useRef<number>(0);

    // scroll to appropriate position when new messages are loaded
    useEffect(() => {
        if (chatAreaRef.current) {
            const newHeight = chatAreaRef.current.scrollHeight;
            chatAreaRef.current.scrollTop = newHeight - prevScrollHeightRef.current;
            prevScrollHeightRef.current = chatAreaRef.current.scrollHeight;
        }
    }, [data?.pages]);

    // scroll to bottom on intial load in case messages are cached
    useEffect(() => {
        if (chatAreaRef.current) {
            chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
            // set visibile after scrolling to avoid ugly jump
            chatAreaRef.current.style.visibility = 'visible';
        }
    }, [chatAreaRef]);

    if (isLoading) {
        return (
            <div className="relative h-screen grow flex justify-center items-center">
                <Image src="/img/loading.gif" width={100} height={100} alt="Loading" />
            </div>
        )
    }
    
    if (error) {
        return (
            <div className="relative h-screen grow flex justify-center items-center">
                <p className="text-6xl text-slate-500">:(</p>
            </div>
        )
    }

    return (
        <div className="relative h-screen grow">
            <div className="absolute z-10 h-[48px] w-full bg-white flex items-center p-3 shadow-b">
                <p className="mr-2 text-gray-500 text-xl font-bold">T</p>
                <p className="text-lg text-gray-600">{data?.pages[0]?.channel.name}</p>
            </div>
            <div style={{ visibility: 'hidden' }} className="absolute bottom-[70px] max-h-full w-full overflow-y-scroll w-auto" ref={chatAreaRef} onScroll={(e) => onMessagesScrolled(e)}>
                <div>
                    <div className="h-[118px] mb-2"></div>
                    {data?.pages.map((page, index) => (
                        <Fragment key={index}>
                            {page.messages.map((message) => {
                                return <ChatMessage key={message.messageId} message={message} user={userMap.get(message.userId)} />
                            })}
                        </Fragment>

                    ))}
                </div>
            </div>
            <div className="flex justify-center items-center absolute bottom-0 h-[70px] w-full p-3">
                <input 
                    type="text" 
                    placeholder={`Send a message to ${data?.pages[0]?.channel.name}...`} 
                    className="w-full bg-slate-100 p-3 rounded focus:outline-none"    
                />
            </div>
        </div>
    )
}

export default function ChatAreaWrapper({ channelId, users }: { channelId: string, users: UserArrayT }) {
    return (
        <QueryClientProvider client={queryClient}>
            <ChatArea channelId={channelId} users={users} />
        </QueryClientProvider>
    )
}