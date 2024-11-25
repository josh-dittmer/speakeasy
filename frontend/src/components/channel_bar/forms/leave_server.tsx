import { deleteChannel, leaveServer } from '@/lib/api/requests';
import { editChannelMutation } from '@/lib/mutations/edit_channel';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import { ChannelArrayT, ChannelT, maxChannelNameLength, ServerT } from 'models';
import Popup from '@/components/ui/popup/popup';
import { LogOut, Plus, Settings, Trash } from 'lucide-react';
import { createChannelMutation } from '@/lib/mutations/create_channel';
import { getServerListKey } from '@/lib/queries/get_server_list';
import { CLIENT_ID } from '@/lib/util/client_id';

export default function LeaveServer({ server, menuOpen, setMenuOpen } : { server: ServerT, menuOpen: boolean, setMenuOpen: Dispatch<SetStateAction<boolean>> }) {
    const router = useRouter();
    const client = useQueryClient();
    
    const handleLeaveServer = async () => {
        await leaveServer(server.serverId, {
            clientId: CLIENT_ID
        });
        client.invalidateQueries({ queryKey: [getServerListKey()] });

        router.push('/home');
    };

    return (
        <Popup open={menuOpen}>
            <div className="flex items-center p-3">
                <LogOut width={25} height={25} className="text-fg-medium" />
                <h1 className="ml-3 text-fg-dark text-2xl">Leave Server</h1>
            </div>
            <div className="p-3">
                <p className="text-fg-dark mb-2">Are you sure you want to leave <span className="font-bold">{server.name}</span>?</p>
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
                        onClick={handleLeaveServer}
                        className="text-fg-accent bg-bg-accent hover:bg-bg-accent-dark p-2 rounded"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </Popup>
    )
}