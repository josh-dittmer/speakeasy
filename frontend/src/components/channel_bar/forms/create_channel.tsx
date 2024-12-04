import { CancelButton, SubmitButton } from '@/components/ui/forms/button/button';
import { NormalForm } from '@/components/ui/forms/form/form';
import ButtonSection from '@/components/ui/forms/section/button_section';
import TitleSection from '@/components/ui/forms/section/title_section';
import TextBox from '@/components/ui/forms/text_box/text_box';
import Popup from '@/components/ui/popup/popup';
import { useCreateChannelMutation } from '@/lib/mutations/create_channel';
import { CLIENT_ID } from '@/lib/util/client_id';
import { Plus } from 'lucide-react';
import { maxChannelNameLength, ServerT } from 'models';
import { Dispatch, SetStateAction, useState } from 'react';

export default function CreateChannel({
    server,
    menuOpen,
    setMenuOpen,
}: {
    server: ServerT;
    menuOpen: boolean;
    setMenuOpen: Dispatch<SetStateAction<boolean>>;
}) {
    const [channelName, setChannelName] = useState<string>('');
    const [channelNameValid, setChannelNameValid] = useState<boolean>();

    const [submitted] = useState<boolean>();

    const valid = channelNameValid;

    const { mutate } = useCreateChannelMutation(server.serverId, CLIENT_ID);

    const handleCreateChannel = async () => {
        mutate({
            name: channelName,
        });

        setChannelName('');
        setMenuOpen(false);
    };

    return (
        <Popup open={menuOpen}>
            <NormalForm>
                <TitleSection title={server.name} icon={Plus} />
                <TextBox
                    value={channelName}
                    setValue={setChannelName}
                    title={'Channel Name'}
                    placeholder={'Channel name...'}
                    maxChars={maxChannelNameLength}
                    submitted={submitted}
                    setValid={setChannelNameValid}
                />
                <ButtonSection>
                    <CancelButton onClick={() => setMenuOpen(false)} />
                    <SubmitButton onClick={handleCreateChannel} enabled={valid} />
                </ButtonSection>
            </NormalForm>
        </Popup>
    );
}
