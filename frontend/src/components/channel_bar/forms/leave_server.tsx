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
import TitleSection from '@/components/ui/forms/section/title_section';
import DescriptionSection from '@/components/ui/forms/section/description_section';
import ButtonSection from '@/components/ui/forms/section/button_section';
import { CancelButton, SubmitButton } from '@/components/ui/forms/button/button';
import { NormalForm } from '@/components/ui/forms/form/form';

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
            <NormalForm>
                <TitleSection title={'Leave Server'} icon={LogOut} />
                <DescriptionSection>
                    <span>Are you sure you want to leave <span className="font-bold">{server.name}</span>?</span>
                </DescriptionSection>
                <ButtonSection>
                    <CancelButton onClick={() => setMenuOpen(false)} />
                    <SubmitButton onClick={handleLeaveServer} enabled={true} text={'Confirm'} />
                </ButtonSection>
            </NormalForm>
        </Popup>
    )
}