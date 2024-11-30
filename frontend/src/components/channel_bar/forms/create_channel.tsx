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
import TitleSection from '@/components/ui/forms/section/title_section';
import TextBox from '@/components/ui/forms/text_box/text_box';
import ButtonSection from '@/components/ui/forms/section/button_section';
import { CancelButton, SubmitButton } from '@/components/ui/forms/button/button';
import { NormalForm } from '@/components/ui/forms/form/form';

export default function CreateChannel({ server, menuOpen, setMenuOpen } : { server: ServerT, menuOpen: boolean, setMenuOpen: Dispatch<SetStateAction<boolean>> }) {
    const [channelName, setChannelName] = useState<string>('');
    const [channelNameValid, setChannelNameValid] = useState<boolean>();

    const [submitted, setSubmitted] = useState<boolean>();

    const valid = channelNameValid;

    const { mutate } = createChannelMutation(server.serverId, CLIENT_ID);

    const handleCreateChannel = async () => {
        mutate({
            name: channelName
        });

        setChannelName('');
        setMenuOpen(false);
    };

    return (
        <Popup open={menuOpen}>
            <NormalForm>
                <TitleSection title={server.name} icon={Plus} />
                <TextBox value={channelName} setValue={setChannelName} title={'Channel Name'} placeholder={'Channel name...'} maxChars={maxChannelNameLength} submitted={submitted} setValid={setChannelNameValid} />
                <ButtonSection>
                    <CancelButton onClick={() => setMenuOpen(false)} />
                    <SubmitButton onClick={handleCreateChannel} enabled={valid} />
                </ButtonSection>
            </NormalForm>
        </Popup>
    )
}