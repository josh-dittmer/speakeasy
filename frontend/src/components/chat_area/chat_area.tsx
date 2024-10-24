'use client';

import { getChannelData } from '@/lib/api/requests';
import { keepPreviousData, QueryClient, QueryClientProvider, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { MessageArrayT, MessageT, UserArrayT, UserT } from 'models';
import Image from 'next/image';
import { createRef, Fragment, useEffect, useRef, useState } from 'react';

import './chat_area.css';
import LoadingSpinner from '../loading_spinner/loading_spinner';

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
                    <p className="text-lg text-fg-dark">{user?.name}</p>
                    <p className="ml-3 text-xs text-fg-light">{message.date}</p>
                </div>
                <div className="">
                    <p className="text-md text-fg-dark">{message.content}</p>
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
    });

    const onMessagesScrolled = (e: any) => {
        const st = chatAreaRef.current?.scrollTop;
        const sh = chatAreaRef?.current?.scrollHeight;
        const ch = chatAreaRef?.current?.clientHeight;
        if (st && sh && st + sh === ch) {
            fetchNextPage();
        } else if (chatAreaRef.current?.scrollTop === 0) {
            
        }
    };

    const chatAreaRef = createRef<HTMLDivElement>();
    const prevScrollHeightRef = useRef<number>(0);

    // scroll to appropriate position when new messages are loaded
    // please do not ask me wtf is going on here i tried different combos until it worked
    useEffect(() => {
        const st = chatAreaRef.current?.scrollTop;
        const sh = chatAreaRef?.current?.scrollHeight;

        if (sh && prevScrollHeightRef.current === 0) {
            prevScrollHeightRef.current = sh;
        }   

        if (st && sh && chatAreaRef.current) {
            chatAreaRef.current.scrollTop = (sh + st) - prevScrollHeightRef.current;
            prevScrollHeightRef.current = sh;
        }
    }, [data?.pages]);

    if (isLoading) {
        return <LoadingSpinner />

    }
    
    if (error) {
        return (
            <div className="relative h-screen grow flex justify-center items-center">
                <p className="text-6xl text-fg-medium">:(</p>
            </div>
        )
    }

    return (
        <div className="chat-area h-screen bg-bg-light">
            <div className="w-full bg-bg-light flex items-center p-3 shadow-b z-10">
                <p className="mr-2 text-fg-medium text-xl font-bold">T</p>
                <p className="text-lg text-fg-medium">{data?.pages[0]?.channel.name}</p>
            </div>
            <div className="flex flex-col-reverse w-full overflow-y-scroll" ref={chatAreaRef} onScroll={(e) => onMessagesScrolled(e)}>
                <div className="mt-2">
                    {data?.pages.map((page, index) => (
                        <Fragment key={index}>
                            {page.messages.map((message) => {
                                return <ChatMessage key={message.messageId} message={message} user={userMap.get(message.userId)} />
                            })}
                        </Fragment>

                    ))}
                </div>
            </div>
            <div className="flex justify-center items-center w-full p-3">
                <input 
                    type="text" 
                    placeholder={`Send a message to ${data?.pages[0]?.channel.name}...`} 
                    className="w-full bg-bg-medium text-fg-medium p-3 rounded focus:outline-none"    
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