'use client';

import { MessageT, UserT } from 'models';
import { createRef, Fragment, useMemo } from 'react';

import { useFailedMessageState, usePendingMessageState } from '@/lib/mutations/create_message';
import { useGetChannelDataQuery } from '@/lib/queries/get_channel_data';
import LoadingSpinner from '../loading_spinner/loading_spinner';
import ThemeToggle from '../theme_toggle/theme_toggle';
import ChatBox from './chat_box/chat_box';

import { useGetServerDataQuery } from '@/lib/queries/get_server_data';
import './chat_area.css';
import FailedMessage from './chat_message/failed_message';
import PendingMessage from './chat_message/pending_message';
import SentMessage, { MessageType } from './chat_message/sent_message';

export default function ChatArea({ serverId, channelId }: { serverId: string; channelId: string }) {
    const { data: serverData } = useGetServerDataQuery(serverId);

    const userMap = useMemo(() => {
        if (!serverData) return null;

        const m = new Map<string, UserT>();
        serverData.users.map(user => {
            m.set(user.userId, user);
        });

        return m;
    }, [serverData]);

    const pendingMessages = usePendingMessageState(channelId);
    const failedMessages = useFailedMessageState(channelId);

    const chatAreaRef = createRef<HTMLDivElement>();
    //const prevHeight = useRef<number>(0);

    const { fetchNextPage, data, isLoading, isError } = useGetChannelDataQuery(channelId);

    const onMessagesScrolled = () => {
        /*const st = chatAreaRef.current?.scrollTop;
        const sh = chatAreaRef?.current?.scrollHeight;
        const ch = chatAreaRef?.current?.clientHeight;

        if (!st || !sh || !ch) return;

        const topDist = Math.abs(Math.abs(st) + ch - sh);

        if (topDist < 3) {
            fetchNextPage();
        }*/
        fetchNextPage();
    };

    const getMessageType = (curr: MessageT, prev: MessageT | undefined): MessageType => {
        if (!prev) return MessageType.FULL;

        if (curr.userId === prev.userId && curr.date - prev.date < 180000) {
            return MessageType.MINIMAL;
        }

        return MessageType.FULL;
    };

    // scroll to appropriate position when new messages are loaded
    // please do not ask me wtf is going on here i tried different combos until it worked
    /*useEffect(() => {
        const st = chatAreaRef.current?.scrollTop;
        const sh = chatAreaRef?.current?.scrollHeight;
        const ch = chatAreaRef?.current?.clientHeight;

        if (sh && ch && sh <= ch) {
            console.log('fill in page');
            fetchNextPage();
        }

        if (st && sh && chatAreaRef.current) {
            //const addedHeight = 0;
            const addedHeight = sh - prevHeight.current;
            prevHeight.current = sh;

            chatAreaRef.current.scrollTop = st + addedHeight;
            //chatAreaRef.current.scrollTop = -100;

            //console.log(chatAreaRef.current.scrollTop);
        }
    }, [data, prevHeight, chatAreaRef, fetchNextPage]);*/

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isError) {
        return (
            <div className="relative h-screen grow flex justify-center items-center">
                <p className="text-6xl text-fg-medium">:(</p>
            </div>
        );
    }

    if (!data || !userMap) return;

    return (
        <div className="chat-area h-screen bg-bg-light min-w-0">
            <div className="w-full bg-bg-light flex items-center p-3 shadow-b z-10 h-header">
                <p className="mr-2 text-fg-medium text-xl font-bold">T</p>
                <p className="text-lg text-fg-medium">{data.pages[0]?.channel.name}</p>
                <div className="block lg:hidden flex grow justify-end items-center">
                    <ThemeToggle />
                </div>
            </div>
            <div
                className="grow flex flex-col-reverse w-full overflow-y-scroll overflow-x-hidden"
                ref={chatAreaRef}
                onScroll={() => onMessagesScrolled()}
            >
                <div className="mt-2">
                    {data.pages.map((page, pIndex) => (
                        <Fragment key={pIndex}>
                            {page.messages.map((message, mIndex) => {
                                let type: MessageType = MessageType.MINIMAL;
                                if (mIndex <= 0) {
                                    if (pIndex <= 0) {
                                        type = MessageType.FULL;
                                    } else {
                                        const prevPage = data.pages.at(pIndex - 1);
                                        type = getMessageType(
                                            message,
                                            prevPage?.messages.at(prevPage.messages.length - 1),
                                        );
                                    }
                                } else {
                                    type = getMessageType(message, page.messages.at(mIndex - 1));
                                }
                                return (
                                    <SentMessage
                                        key={message.messageId}
                                        message={message}
                                        user={userMap.get(message.userId)}
                                        type={type}
                                    />
                                );
                            })}
                        </Fragment>
                    ))}
                    <Fragment key="failed">
                        {failedMessages.map((req, index) => {
                            return <FailedMessage key={index} />;
                        })}
                    </Fragment>
                    <Fragment key="pending">
                        {pendingMessages.map((req, index) => {
                            return <PendingMessage key={index} />;
                        })}
                    </Fragment>
                </div>
            </div>
            {data.pages[0]?.channel && <ChatBox channel={data.pages[0].channel} />}
        </div>
    );
}
