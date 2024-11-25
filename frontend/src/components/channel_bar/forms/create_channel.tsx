import { deleteChannel } from '@/lib/api/requests';
import { editChannelMutation } from '@/lib/mutations/edit_channel';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import { ChannelArrayT, ChannelT, maxChannelNameLength, ServerT } from 'models';
import Popup from '@/components/ui/popup/popup';
import { Plus, Settings, Trash } from 'lucide-react';
import { createChannelMutation } from '@/lib/mutations/create_channel';
import { CLIENT_ID } from '@/lib/util/client_id';

export default function CreateChannel({ server, menuOpen, setMenuOpen } : { server: ServerT, menuOpen: boolean, setMenuOpen: Dispatch<SetStateAction<boolean>> }) {
    const [channelName, setChannelName] = useState<string>('');

    const { mutate } = createChannelMutation(server.serverId, CLIENT_ID);

    const handleCreateChannel = async () => {
        if (channelName.length < maxChannelNameLength && channelName.length > 0) {
            mutate({
                name: channelName
            });
            setChannelName('');
            setMenuOpen(false);
        } else {

        }
    };

    return (
        <Popup open={menuOpen}>
            <div className="flex items-center p-3">
                <Plus width={25} height={25} className="text-fg-medium" />
                <h1 className="ml-3 text-fg-dark text-2xl">Create New Channel</h1>
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
                <div className="flex grow justify-end">
                    <button
                        onClick={() => setMenuOpen(false)}
                        className="text-fg-dark bg-bg-light hover:bg-bg-medium p-2 rounded mr-3"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreateChannel}
                        className="text-fg-accent bg-bg-accent hover:bg-bg-accent-dark p-2 rounded"
                    >
                        Create
                    </button>
                </div>
            </div>
        </Popup>
    )
}