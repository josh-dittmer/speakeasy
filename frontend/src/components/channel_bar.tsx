import { ChannelArrayT, ChannelT } from 'models';

function TextChannel({ channel, selected } : { channel: ChannelT, selected: boolean }) {
    return (
        <div className={(selected ? 'bg-gray-200' : 'hover:bg-gray-200' ) + " flex items-center p-1.5 mb-1 rounded"}>
            <p className="mr-2 text-gray-500 text-xl font-bold">T</p>
            <p className="text-gray-500 text-md">{channel.name}</p>
        </div>
    )
}

export default function ChannelBar({ channels, selectedChannelId }: { channels: ChannelArrayT, selectedChannelId: string }) {
    return (
        <div className="bg-slate-100 h-screen w-52">
            <div className="flex items-center absolute h-[48px] w-52 shadow-b p-3">
                <p className="text-xl truncate">Poo</p>
            </div>
            <div className="flex items-center absolute h-[48px] top-[48px] p-3">
                <p className="text-xs font-bold text-gray-500">TEXT CHANNELS</p>
            </div>
            <div className="absolute h-[96px] top-[96px] w-52 p-3 pt-0 h-full overflow-y-scroll">
                {channels.map((channel, index) => {
                    return <TextChannel key={index} channel={channel} selected={channel.channelId === selectedChannelId} />
                })}
            </div>
        </div>
    )
}