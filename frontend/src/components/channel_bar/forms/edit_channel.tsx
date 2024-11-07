import { deleteChannel } from '@/lib/api/requests';
import { editChannelMutation } from '@/lib/mutations/edit_channel';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import { invalidateServerData } from '../actions';
import { ChannelArrayT, ChannelT, maxChannelNameLength, ServerT } from 'models';
import Popup from '@/components/ui/popup/popup';
import { Settings, Trash } from 'lucide-react';

export default function EditChannel({ channel, server, selectedChannelId, channels, menuOpen, setMenuOpen } : { channel: ChannelT, server: ServerT, selectedChannelId: string, channels: ChannelArrayT, menuOpen: boolean, setMenuOpen: Dispatch<SetStateAction<boolean>> }) {
    const [channelName, setChannelName] = useState<string>(channel.name);
    
    const client = useQueryClient();
    const { mutate } = editChannelMutation(client, channel.channelId);

    const router = useRouter();

    const handleDeleteChannel = async () => {
        await deleteChannel(channel.channelId);
        invalidateServerData(server.serverId);

        if (selectedChannelId === channel.channelId) {
            const next = channels.find((channel) => channel.channelId !== selectedChannelId);
            router.push((next) ? `/home/${server.serverId}/${next.channelId}` : `/home/${server.serverId}/empty`);
        } else {
            router.refresh();
        }
    };

    const handleChannelEdit = () => {
        if (channelName === channel.name) {
            setMenuOpen(false);
            return;
        }

        if (channelName.length < maxChannelNameLength && channelName.length > 0) {
            invalidateServerData(server.serverId);
            mutate({
                name: channelName
            });
            setMenuOpen(false);
        } else {

        }
    };

    return (
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
                <div className="text-red-600 hover:text-red-800">
                    <button
                        onClick={() => {
                            setMenuOpen(false)
                            handleDeleteChannel();
                        }}
                        className="flex items-center"
                    >
                        <Trash width={15} height={15} className="mr-2" />
                        <p>Delete Channel</p>
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
    )
}