import { createInvite, deleteChannel, leaveServer } from '@/lib/api/requests';
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
import { createInviteMutation } from '@/lib/mutations/create_invite';
import Dropdown, { Option } from '@/components/ui/forms/dropdown/dropdown';

export default function CreateInvite({ server, menuOpen, setMenuOpen } : { server: ServerT, menuOpen: boolean, setMenuOpen: Dispatch<SetStateAction<boolean>> }) {
    const [timeOption, setTimeOption] = useState<string>('1');
    const [timeOptionValid, setTimeOptionValid] = useState<boolean>();
    
    const [submitted, setSubmitted] = useState<boolean>();

    const valid = timeOptionValid;

    const allowedTimeOptions: Option[] = [
        { value: '1', title: '5 minutes' },
        { value: '2', title: '1 hour' },
        { value: '3', title: '8 hours' },
        { value: '4', title: '24 hours' },
        { value: '5', title: '30 days' },
        { value: '6', title: 'Forever' },
    ];

    const { mutate, isPending } = createInviteMutation(server.serverId);
    
    const handleCreateInvite = async () => {
        /*mutate({
            validFor: 0,
            callbackFn: (inviteId: string) => {
                // do stuff
            }
        });*/
        console.log(timeOption);
    };

    return (
        <Popup open={menuOpen}>
            <NormalForm>
                <TitleSection title={'Create Invite'} icon={Plus} />
                <Dropdown options={allowedTimeOptions} selectedOption={timeOption} setSelectedOption={setTimeOption} title={'Time until expiration'} submitted={submitted} setValid={setTimeOptionValid} />
                <ButtonSection>
                    <CancelButton onClick={() => setMenuOpen(false)} />
                    <SubmitButton onClick={handleCreateInvite} enabled={valid} text={'Create'} />
                </ButtonSection>
            </NormalForm>
        </Popup>
    )
}