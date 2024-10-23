'use client';

import { getChannelData } from '@/lib/requests';
import { keepPreviousData, QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { MessageArrayT, MessageT, UserArrayT, UserT } from 'models';
import Image from 'next/image';
import { createRef, useEffect, useRef, useState } from 'react';

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
    })

    const [prevMessages, setPrevMessages] = useState<MessageArrayT>([]);
    const [currMessages, setCurrMessages] = useState<MessageArrayT>([]);
    const [nextMessages, setNextMessages] = useState<MessageArrayT>([]);

    const [messages, setMessages] = useState<MessageArrayT>([]);

    const [page, setPage] = useState<number>(0);
    const [maxPage, setMaxPage] = useState<number>(Number.MAX_SAFE_INTEGER);

    const { isPending, error, data } = useQuery({
        queryKey: [channelId, page],
        queryFn: () => getChannelData(channelId, page),
        placeholderData: keepPreviousData
    });

    const onMessagesScrolled = (e: any) => {
        if (chatAreaRef.current?.scrollTop === 0 && page + 1 <= maxPage) {
            setPage((old) => old + 1);
        } else if (chatAreaRef.current?.scrollTop === chatAreaRef?.current?.scrollHeight && page > 0) {
            //setPage((old) => old - 1);
        }
    };

    const chatAreaRef = createRef<HTMLDivElement>();
    const prevScrollHeightRef = useRef<number>(0);

    // add new messages to screen
    useEffect(() => {
        if (data?.messages) {
            // when server returns empty message array, the max page has been reached
            if (data.messages.length === 0 && page !== 0) {
                setMaxPage(page - 1);
                //setPage((old) => old - 1);
            }

            setMessages((old) => [...data?.messages, ...old]);
        }
    }, [data?.messages]);

    // scroll to appropriate position when new messages are loaded
    useEffect(() => {
        if (chatAreaRef.current ) {
            const newHeight = chatAreaRef.current.scrollHeight;
            chatAreaRef.current.scrollTop = newHeight - prevScrollHeightRef.current;
            prevScrollHeightRef.current = chatAreaRef.current.scrollHeight;
        }
    }, [messages]);

    if (isPending) {
        return (
            <p>Loading...</p>
        )
    }
    
    if (error) {
        return (
            <p>Error</p>
        )
    }

    return (
        <div className="relative h-screen grow">
            <div className="absolute z-10 h-[48px] w-full bg-white flex items-center p-3 shadow-b">
                <p className="mr-2 text-gray-500 text-xl font-bold">T</p>
                <p className="text-lg text-gray-600">{data.channel.name}</p>
            </div>
            <div className="absolute bottom-[70px] max-h-full w-full overflow-y-scroll w-auto" ref={chatAreaRef} onScroll={(e) => onMessagesScrolled(e)}>
                <div>
                    <div className="h-[118px] mb-2"></div>
                    {messages.map((message, index) => {
                        return <ChatMessage key={index} message={message} user={userMap.get(message.userId)} />
                    })}
                </div>
            </div>
            <div className="flex justify-center items-center absolute bottom-0 h-[70px] w-full p-3">
                <input 
                    type="text" 
                    placeholder={`Send a message to ${data.channel.name}...`} 
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