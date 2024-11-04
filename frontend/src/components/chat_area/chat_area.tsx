'use client';

import { MessageT, UserArrayT, UserT } from 'models';
import Image from 'next/image';
import { createRef, Fragment, useEffect, useMemo, useRef } from 'react';

import LoadingSpinner from '../loading_spinner/loading_spinner';
import ThemeToggle from '../theme_toggle/theme_toggle';
import ChatBox from './chat_box/chat_box';
import { failedMessageState, pendingMessageState } from '@/lib/mutations/create_message';
import { getChannelDataQuery } from '@/lib/queries/get_channel_data';

import './chat_area.css';
import SentMessage from './chat_message/sent_message';
import PendingMessage from './chat_message/pending_message';
import FailedMessage from './chat_message/failed_message';

export default function ChatArea({ channelId, users }: { channelId: string, users: UserArrayT }) {
    const userMap: Map<string, UserT> = useMemo(() => {
        const m = new Map<string, UserT>();
        users.map((user) => {
            m.set(user.userId, user);
        });

        return m;
    }, [users]);

    const pendingMessages = pendingMessageState(channelId);
    const failedMessages = failedMessageState(channelId);

    const { fetchNextPage, data, isLoading, isError, isPending } = getChannelDataQuery(channelId);

    const onMessagesScrolled = () => {
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
    /*useEffect(() => {
        const st = chatAreaRef.current?.scrollTop;
        const sh = chatAreaRef?.current?.scrollHeight;

        if (sh && prevScrollHeightRef.current === 0) {
            prevScrollHeightRef.current = sh;
        }   

        if (st && sh && chatAreaRef.current) {
            chatAreaRef.current.scrollTop = (sh + st) - prevScrollHeightRef.current;
            prevScrollHeightRef.current = sh;
        }
    }, [data?.pages, chatAreaRef]);*/

    if (isLoading) {
        return <LoadingSpinner />
    }
    
    if (isError) {
        return (
            <div className="relative h-screen grow flex justify-center items-center">
                <p className="text-6xl text-fg-medium">:(</p>
            </div>
        )
    }

    return (
        <div className="chat-area h-screen bg-bg-light min-w-0">
            <div className="w-full bg-bg-light flex items-center p-3 shadow-b z-10 h-header">
                <p className="mr-2 text-fg-medium text-xl font-bold">T</p>
                <p className="text-lg text-fg-medium">{data?.pages[0]?.channel.name}</p>
                <div className="block md:hidden flex grow justify-end items-center">
                    <ThemeToggle />
                </div>
            </div>
            <div className="grow flex flex-col-reverse w-full overflow-y-scroll overflow-x-hidden" ref={chatAreaRef} onScroll={() => onMessagesScrolled()}>
                <div className="mt-2">
                    {data?.pages.map((page, index) => (
                        <Fragment key={index}>
                            {page.messages.map((message) => {
                                return <SentMessage key={message.messageId} message={message} user={userMap.get(message.userId)} />
                            })}
                        </Fragment>
                    ))}
                    <Fragment key="failed">
                        {failedMessages.map((req, index) => {
                            return <FailedMessage key={index} messageReq={req} />;
                        })}
                    </Fragment>
                    <Fragment key="pending">
                        {pendingMessages.map((req, index) => {
                            return <PendingMessage key={index} messageReq={req} />;
                        })}
                    </Fragment>
                </div>
            </div>
            {data?.pages[0]?.channel && (
                <ChatBox channel={data.pages[0].channel} />
            )}
        </div>
    )
}