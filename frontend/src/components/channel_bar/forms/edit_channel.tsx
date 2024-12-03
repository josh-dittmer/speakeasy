import { deleteChannel, Tags } from '@/lib/api/requests';
import { editChannelMutation } from '@/lib/mutations/edit_channel';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import { ChannelArrayT, ChannelT, maxChannelNameLength, ServerT } from 'models';
import Popup from '@/components/ui/popup/popup';
import { Settings, Trash } from 'lucide-react';
import { getChannelDataKey } from '@/lib/queries/get_channel_data';
import { getServerDataKey } from '@/lib/queries/get_server_data';
import { CLIENT_ID } from '@/lib/util/client_id';
import TitleSection from '@/components/ui/forms/section/title_section';
import TextBox from '@/components/ui/forms/text_box/text_box';
import ButtonSection from '@/components/ui/forms/section/button_section';
import { CancelButton, DeleteButton, SubmitButton } from '@/components/ui/forms/button/button';
import { NormalForm } from '@/components/ui/forms/form/form';

export default function EditChannel({ channel, server, selected, channels, menuOpen, setMenuOpen } : { channel: ChannelT, server: ServerT, selected: boolean, channels: ChannelArrayT, menuOpen: boolean, setMenuOpen: Dispatch<SetStateAction<boolean>> }) {
    const [channelName, setChannelName] = useState<string>(channel.name);
    const [channelNameValid, setChannelNameValid] = useState<boolean>();

    const [submitted, setSubmitted] = useState<boolean>();

    const valid = channelNameValid;

    const client = useQueryClient();
    const { mutate } = editChannelMutation(client, server.serverId, channel.channelId);

    const router = useRouter();

    const handleDeleteChannel = async () => {
        await deleteChannel(channel.channelId, {
            clientId: CLIENT_ID
        });
        
        client.invalidateQueries({ queryKey: [Tags.serverData, getServerDataKey(server.serverId)] });

        if (selected) {
            const next = channels.find((c) => c.channelId !== channel.channelId);
            router.push((next) ? `/home/${server.serverId}/${next.channelId}` : `/home/${server.serverId}/empty`);
        }
    };

    const handleChannelEdit = () => {
        if (channelName === channel.name) {
            setMenuOpen(false);
        }

        else {
            mutate({
                name: channelName,
                clientId: CLIENT_ID
            });

            setMenuOpen(false);
        }
    };

    return (
        <Popup open={menuOpen}>
            <NormalForm>
                <TitleSection title={server.name} icon={Settings} />
                <TextBox value={channelName} setValue={setChannelName} title={'Channel Name'} placeholder={'Channel name...'} maxChars={maxChannelNameLength} submitted={submitted} setValid={setChannelNameValid} />
                <ButtonSection>
                    <DeleteButton onClick={handleDeleteChannel} text={'Delete Channel'} />
                    <CancelButton onClick={() => setMenuOpen(false)} />
                    <SubmitButton onClick={handleChannelEdit} enabled={valid} />
                </ButtonSection>
            </NormalForm>
        </Popup>
    )
}