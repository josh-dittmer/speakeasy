'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChannelArrayT, ChannelT } from 'models';
import ThemeToggle from '../theme_toggle/theme_toggle';

function TextChannel({ channel, selected } : { channel: ChannelT, selected: boolean }) {
    return (
        <Link href={`/home/${channel.serverId}/${channel.channelId}`}>
        <div className={(selected ? 'bg-bg-dark' : 'hover:bg-bg-dark' ) + " flex items-center p-1.5 mb-1 rounded"}>
            <p className="mr-2 text-fg-medium text-xl font-bold">T</p>
            <p className="text-fg-medium text-md">{channel.name}</p>
        </div>
        </Link>
    )
}

export default function ChannelBar({ channels, serverName }: { channels: ChannelArrayT, serverName: string }) {    
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
                    return <TextChannel key={channel.channelId} channel={channel} selected={channel.channelId === selectedChannelId} />
                })}
            </div>
        </div>
    )
}