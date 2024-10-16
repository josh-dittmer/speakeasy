'use client';

import { useState } from 'react';

function TextChannel({ channelName, selected} : { channelName: string, selected: boolean }) {
    return (
        <div className={(selected ? 'bg-gray-200' : 'hover:bg-gray-200' ) + " flex items-center p-1.5 mb-1 rounded"}>
            <p className="mr-2 text-gray-500 text-xl font-bold">T</p>
            <p className="text-gray-500 text-md">{channelName}</p>
        </div>
    )
}

export default function ChannelBar() {
    const [serverName, setServerName] = useState('Test Server');
    
    return (
        <div className="bg-slate-100 h-screen w-52">
            <div className="flex items-center absolute h-[48px] w-52 shadow-b p-3">
                <p className="text-xl truncate">{serverName}</p>
            </div>
            <div className="flex items-center absolute h-[48px] top-[48px] p-3">
                <p className="text-xs font-bold text-gray-500">TEXT CHANNELS</p>
            </div>
            <div className="absolute h-[96px] top-[96px] w-52 p-3 pt-0 h-full overflow-y-scroll">
                <TextChannel channelName="Test Channel" selected={false} />
                <TextChannel channelName="Test Channel" selected={false} />
                <TextChannel channelName="Test Channel" selected={false} />
                <TextChannel channelName="Test Channel" selected={true} />
                <TextChannel channelName="Test Channel" selected={false} />
                <TextChannel channelName="Test Channel" selected={false} />
                <TextChannel channelName="Test Channel" selected={false} />
                <TextChannel channelName="Test Channel" selected={false} />
                <TextChannel channelName="Test Channel" selected={false} />
                <TextChannel channelName="Test Channel" selected={false} />
                <TextChannel channelName="Test Channel" selected={false} />
                <TextChannel channelName="Test Channel" selected={false} />
                <TextChannel channelName="Test Channel" selected={false} />
                <TextChannel channelName="Test Channel" selected={false} />
                <TextChannel channelName="Test Channel" selected={false} />
                <TextChannel channelName="Test Channel" selected={false} />
                <TextChannel channelName="Test Channel" selected={false} />
                <TextChannel channelName="Test Channel" selected={false} />
                <TextChannel channelName="Test Channel" selected={false} />
                <TextChannel channelName="Test Channel" selected={false} />
                <TextChannel channelName="Test Channel" selected={false} />
                <TextChannel channelName="Test Channel" selected={false} />
                <TextChannel channelName="Test Channel" selected={false} />
                <TextChannel channelName="Test Channel" selected={false} />
                <TextChannel channelName="Test Channel" selected={false} />
                <TextChannel channelName="Test Channel" selected={false} />
            </div>
        </div>
    )
}