'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChannelArrayT, ChannelT, ServerT } from 'models';
import { ChevronDown, ChevronUp, Plus, Settings } from 'lucide-react';
import { useState } from 'react';
import EditChannel from './forms/edit_channel';
import CreateChannel from './forms/create_channel';

import './channel_bar.css'
import ServerMenu from './forms/server_menu';
import ProfileInfo from '../profile_info/profile_info';

function TextChannel({ channel, server, selectedChannelId, channels } : { channel: ChannelT, server: ServerT, selectedChannelId: string, channels: ChannelArrayT }) {    
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const router = useRouter();

    const visitChannel = () => {
        router.push(`/home/${channel.serverId}/${channel.channelId}`);
    }

    return (
        <>
            <div onClick={() => visitChannel()} className={(selectedChannelId === channel.channelId ? 'bg-bg-dark' : 'hover:bg-bg-dark' ) + " flex items-center p-1.5 mb-1 rounded text-channel"}>
                <div className="flex items-center">
                    <p className="mr-2 text-fg-medium text-xl font-bold">T</p>
                    <p className="text-fg-medium text-md truncate max-w-32">{channel.name}</p>
                </div>
                <div className="grow flex items-center justify-end menu">
                    <button onClick={() => setMenuOpen(true)}>
                    <div className="">
                        <Settings width={15} height={15} className="text-fg-medium hover:text-fg-dark" />
                    </div>
                    </button>
                </div>
            </div>
            <EditChannel channel={channel} server={server} selectedChannelId={selectedChannelId} channels={channels} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        </>
    )
}

export default function ChannelBar({ channels, server }: { channels: ChannelArrayT, server: ServerT }) {    
    const selectedChannelId = usePathname().split('/')[3];

    const [createChannelOpen, setCreateChannelOpen] = useState<boolean>(false);
    const [serverMenuOpen, setServerMenuOpen] = useState<boolean>(false);

    return (
        <div className="flex flex-col bg-bg-medium h-screen">
            <div className="flex items-center h-header shadow-b p-2">
                <button className="w-full" onClick={() => setServerMenuOpen((old) => !old)}>
                <div className="flex items-center hover:bg-bg-dark p-1 rounded">
                    <p className="text-fg-dark text-xl truncate max-w-32">{server.name}</p>
                    <div className="flex grow justify-end p-1">
                        {serverMenuOpen ? (
                            <ChevronUp width={15} height={15} className="text-fg-medium" />
                        ) : (
                            <ChevronDown width={15} height={15} className="text-fg-medium" />
                        )}
                    </div>
                </div>
                </button>
            </div>
            <ServerMenu server={server} open={serverMenuOpen} setOpen={setServerMenuOpen} />
            <div className="flex items-center h-header p-3">
                <p className="text-xs font-bold text-fg-medium grow">TEXT CHANNELS</p>
                <button onClick={() => setCreateChannelOpen(true)} className="rounded p-1 text-fg-medium hover:text-fg-dark hover:bg-bg-dark">
                    <Plus width={15} height={15} className="" />
                </button>
            </div>
            <div className="p-3 pt-0 overflow-y-scroll grow">
                <div>
                    {channels.map((channel) => {
                        return <TextChannel key={channel.channelId} channel={channel} server={server} selectedChannelId={selectedChannelId} channels={channels} />
                    })}
                </div>
            </div>
            <div className="">
                <ProfileInfo />
            </div>
            <CreateChannel server={server} menuOpen={createChannelOpen} setMenuOpen={setCreateChannelOpen} />
        </div>
    )
}