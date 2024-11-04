'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChannelArrayT, ChannelT, maxChannelNameLength } from 'models';
import ThemeToggle from '../theme_toggle/theme_toggle';
import { deleteChannel } from '@/lib/api/requests';
import { useRouter } from 'next/navigation';
import { Ellipsis, Pencil, Settings, Settings2, Trash } from 'lucide-react';

import './channel_bar.css'
import { invalidateChannels } from './actions';
import Menu, { MenuItem } from '../ui/menu/menu';
import { useState } from 'react';
import Popup from '../ui/popup/popup';
import { editChannelMutation } from '@/lib/mutations/edit_channel';
import { useQueryClient } from '@tanstack/react-query';

function TextChannel({ channel, selectedServerId, selectedChannelId, channels } : { channel: ChannelT, selectedServerId: string, selectedChannelId: string, channels: ChannelArrayT }) {    
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const [channelName, setChannelName] = useState<string>(channel.name);
    
    const client = useQueryClient();
    const { mutate } = editChannelMutation(client, channel.channelId);

    const router = useRouter();

    const handleDeleteChannel = async () => {
        await deleteChannel(channel.channelId);
        invalidateChannels(selectedServerId);

        if (selectedChannelId === channel.channelId) {
            const next = channels.find((channel) => channel.channelId !== selectedChannelId);
            router.push(`/home/${selectedServerId}/${next?.channelId}`);
        } else {
            router.refresh();
        }
    };

    const handleChannelEdit = () => {
        if (channelName === channel.name) {
            setMenuOpen(false);
            return;
        }

        if (channelName.length < maxChannelNameLength) {
            mutate({
                name: channelName
            });
            invalidateChannels(selectedServerId);
            setMenuOpen(false);
        } else {

        }
    };

    return (
        <>
            <div className={(selectedChannelId === channel.channelId ? 'bg-bg-dark' : 'hover:bg-bg-dark' ) + " flex items-center p-1.5 mb-1 rounded text-channel"}>
                <Link href={`/home/${channel.serverId}/${channel.channelId}`} className="">
                <div className="flex items-center">
                    <p className="mr-2 text-fg-medium text-xl font-bold">T</p>
                    <p className="text-fg-medium text-md truncate max-w-32">{channel.name}</p>
                </div>
                </Link>
                <div className="grow flex items-center justify-end menu">
                    <button onClick={() => setMenuOpen(true)}>
                    <div className="">
                        <Settings width={15} height={15} className="text-fg-medium hover:text-fg-dark" />
                    </div>
                    </button>
                </div>
            </div>
            <Popup open={menuOpen}>
                <div className="flex items-center p-3">
                    <Settings width={25} height={25} className="text-fg-medium" />
                    <h1 className="ml-3 text-fg-dark text-2xl">{channel.name}</h1>
                </div>
                <div className="p-3">
                    <p className="text-fg-medium mb-2">Channel Name</p>
                    <input 
                        type="text"
                        placeholder="Channel name..."
                        className="outline-none bg-bg-medium p-2 w-96 rounded text-fg-dark"
                        value={channelName}
                        onChange={(e) => setChannelName(e.target.value)}
                    />
                </div>
                <div className="flex items-center p-3">
                    <div className="">
                        <button
                            onClick={() => {
                                setMenuOpen(false)
                                handleDeleteChannel();
                            }}
                            className="flex items-center"
                        >
                            <Trash width={15} height={15} className="text-red-800 mr-2" />
                            <p className="text-red-800 hover:text-red-900">Delete Channel</p>
                        </button>
                    </div>
                    <div className="flex grow justify-end">
                        <button
                            onClick={() => setMenuOpen(false)}
                            className="text-fg-dark bg-bg-light hover:bg-bg-medium p-2 rounded mr-3"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleChannelEdit}
                            className="text-fg-accent bg-bg-accent hover:bg-bg-accent-dark p-2 rounded"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </Popup>
        </>
    )
}

export default function ChannelBar({ channels, serverName }: { channels: ChannelArrayT, serverName: string }) {    
    const selectedServerId = usePathname().split('/')[2];
    const selectedChannelId = usePathname().split('/')[3];

    return (
        <div className="bg-bg-medium h-screen">
            <div className="flex items-center h-header shadow-b p-3">
                <p className="text-fg-dark text-xl truncate">{serverName}</p>
            </div>
            <div className="flex items-center h-header p-3">
                <p className="text-xs font-bold text-fg-medium">TEXT CHANNELS</p>
            </div>
            <div className="p-3 pt-0 h-full overflow-y-scroll">
                {channels.map((channel) => {
                    return <TextChannel key={channel.channelId} channel={channel} selectedServerId={selectedServerId} selectedChannelId={selectedChannelId} channels={channels} />
                })}
            </div>
        </div>
    )
}