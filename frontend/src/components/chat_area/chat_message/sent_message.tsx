'use client';

import { endpoints } from '@/lib/api/endpoints';
import { Ellipsis, Pencil, Trash } from 'lucide-react';
import { MessageT, UserT } from 'models';
import Image from 'next/image';

import './sent_message.css';
import { useState } from 'react';
import { deleteMessage, Tags } from '@/lib/api/requests';
import { useQueryClient } from '@tanstack/react-query';
import { getChannelDataKey } from '@/lib/queries/get_channel_data';
import MessageFile from './message_file';
import ProfileImage from '@/components/profile_image/profile_image';
import { formatDate } from '@/lib/util/date';
import { CLIENT_ID } from '@/lib/util/client_id';

export enum MessageType {
    FULL, MINIMAL
};

export default function SentMessage({ message, user, type }: { message: MessageT, user: UserT | undefined, type: MessageType }) {    
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const queryClient = useQueryClient();

    const isFull: boolean = type === MessageType.FULL;

    const handleMenuChange = () => {
        setMenuOpen((old) => !old);
    };

    const handleDeleteMessage = async () => {
        await deleteMessage(message.messageId, {
            clientId: CLIENT_ID
        });
        queryClient.invalidateQueries({
            queryKey: [Tags.channelData, getChannelDataKey(message.channelId)]
        });
    };

    const handleEditMessage = () => {

    };
    
    return (
        <div className="relative">
        <div className={'message flex pl-4 truncate hover:bg-bg-medium  ' + (menuOpen ? 'message-highlight ' : ' ') + (isFull ? 'mt-3' : '')}>
            <div className="shrink-0">
                {isFull && user && (
                    <ProfileImage name={user.name} imageId={user?.imageId} className="bg-bg-dark" />
                )}
            </div>
            <div className={isFull ? 'ml-4' : 'ml-16'}>
                {isFull && (
                    <div className="flex items-center">
                        <p className="text-sm text-fg-dark font-bold">{user?.name}</p>
                        <p className="ml-3 text-xs text-fg-light">{formatDate(new Date(message.date))}</p>
                    </div>
                )}
                <div className="">
                    {message.files.map((file) => {
                        return <MessageFile key={file.fileId} file={file} />
                    })}
                </div>
                <div className="mt-1">
                    <p className="text-sm text-fg-dark max-w-xl text-wrap break-all">{message.content}</p>
                </div>
            </div>
            {message.isMine && (
                <div className="grow flex justify-end items-center test">
                    {menuOpen && (
                        <div className="flex items-center menu-items">
                            <button onClick={handleEditMessage}>
                            <div className="message-menu mr-2 shadow p-1 rounded bg-bg-light hover:bg-bg-dark">
                                <Pencil width={20} height={20} className="text-yellow-400" />
                            </div>
                            </button>
                            <button onClick={handleDeleteMessage}>
                            <div className="message-menu mr-2 shadow p-1 rounded bg-bg-light hover:bg-bg-dark">
                                <Trash width={20} height={20} className="text-red-600" />
                            </div>
                            </button>
                        </div>
                    )}
                    <button onClick={(() => handleMenuChange())}>
                    <div className={'message-menu mr-5 shadow p-1 rounded bg-bg-light hover:bg-bg-dark'}>
                        <Ellipsis width={20} height={20} className={'text-fg-dark ' + (menuOpen ? 'menu-icon-open' : 'menu-icon-close')} />
                    </div>
                    </button>
                </div>
            )}
        </div>
        </div>
    )
}