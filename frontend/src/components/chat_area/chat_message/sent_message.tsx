'use client';

import { Ellipsis, Pencil, Trash } from 'lucide-react';
import { MessageT, UserT } from 'models';

import InvitePreview from '@/components/invite_preview/invite_preview';
import ProfileImage from '@/components/profile_image/profile_image';
import { deleteMessage, Tags } from '@/lib/api/requests';
import { getChannelDataKey } from '@/lib/queries/get_channel_data';
import { CLIENT_ID } from '@/lib/util/client_id';
import { formatDate } from '@/lib/util/date';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import MessageFile from './message_file';
import './sent_message.css';

export enum MessageType {
    FULL,
    MINIMAL,
}

export default function SentMessage({
    message,
    user,
    type,
}: {
    message: MessageT;
    user: UserT | undefined;
    type: MessageType;
}) {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const queryClient = useQueryClient();

    const isFull: boolean = type === MessageType.FULL;
    const hasFiles: boolean = message.files.length > 0;
    const hasContent: boolean = message.content.length > 0;

    const handleMenuChange = () => {
        setMenuOpen(old => !old);
    };

    const handleDeleteMessage = async () => {
        await deleteMessage(message.messageId, {
            clientId: CLIENT_ID,
        });
        queryClient.invalidateQueries({
            queryKey: [Tags.channelData, getChannelDataKey(message.channelId)],
        });
    };

    const handleEditMessage = () => { };

    const extractInviteId = (): string | null => {
        const urlPrefix = `${process.env.NEXT_PUBLIC_SELF_URL}/join/`;

        const index = message.content.indexOf(urlPrefix);
        if (index !== -1 && message.content.length - (index + 63) >= 0) {
            return message.content.slice(index + urlPrefix.length, index + urlPrefix.length + 36);
        }

        return null;
    };

    const inviteId = extractInviteId();

    return (
        <div className="relative">
            <div
                className={
                    'message flex pl-4 truncate hover:bg-bg-medium  ' +
                    (menuOpen ? 'message-highlight ' : ' ') +
                    (isFull ? 'mt-2 ' : ' ') +
                    (hasFiles ? ' ' : 'items-center ')
                }
            >
                <div className={'shrink-0 ' + (hasFiles ? 'mt-0.5' : '')}>
                    {isFull && user && (
                        <ProfileImage
                            name={user.name}
                            imageId={user?.imageId}
                            className="bg-bg-dark"
                        />
                    )}
                </div>
                <div className={isFull ? 'flex flex-col gap-1 ml-5 pb-1' : 'pt-1 pb-1 ml-16'}>
                    {isFull && (
                        <div className="flex items-center">
                            <p className="text-sm text-fg-dark font-bold">{user?.name}</p>
                            <p className="ml-3 text-xs text-fg-light">
                                {formatDate(new Date(message.date))}
                            </p>
                        </div>
                    )}
                    {hasFiles && (
                        <div className={isFull ? 'pt-1' : ''}>
                            {message.files.map(file => {
                                return (
                                    <div key={file.fileId} className="pb-1">
                                        <MessageFile file={file} />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {inviteId && (
                        <div className={hasFiles ? 'pt-1' : ''}>
                            <InvitePreview inviteId={inviteId} />
                        </div>
                    )}
                    {hasContent && !inviteId && (
                        <div className={hasFiles ? 'pt-1' : ''}>
                            <p className="text-sm text-fg-dark max-w-xl text-wrap break-all">
                                {message.content}
                            </p>
                        </div>
                    )}
                </div>
                {message.isMine && (
                    <div className="grow flex justify-end items-center test">
                        {menuOpen && (
                            <div className="flex items-center menu-items">
                                <button onClick={handleEditMessage}>
                                    <div className="message-menu mr-2 shadow p-1 rounded bg-bg-light hover:bg-bg-dark">
                                        <Pencil
                                            width={15}
                                            height={15}
                                            className="text-yellow-400"
                                        />
                                    </div>
                                </button>
                                <button onClick={handleDeleteMessage}>
                                    <div className="message-menu mr-2 shadow p-1 rounded bg-bg-light hover:bg-bg-dark">
                                        <Trash width={15} height={15} className="text-red-600" />
                                    </div>
                                </button>
                            </div>
                        )}
                        <button onClick={() => handleMenuChange()}>
                            <div
                                className={
                                    'message-menu mr-5 shadow p-1 rounded bg-bg-light hover:bg-bg-dark'
                                }
                            >
                                <Ellipsis
                                    width={15}
                                    height={15}
                                    className={
                                        'text-fg-dark ' +
                                        (menuOpen ? 'menu-icon-open' : 'menu-icon-close')
                                    }
                                />
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
