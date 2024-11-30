import { useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useState } from 'react';
import { maxFileSize, maxServerNameLength, S3Keys, ServerT } from 'models';
import Popup from '@/components/ui/popup/popup';
import { Settings } from 'lucide-react';
import { editServerMutation } from '@/lib/mutations/edit_server';
import { CLIENT_ID } from '@/lib/util/client_id';
import TitleSection from '@/components/ui/forms/section/title_section';
import ImageUpload from '@/components/ui/forms/file_upload/image_upload';
import TextBox from '@/components/ui/forms/text_box/text_box';
import ButtonSection from '@/components/ui/forms/section/button_section';
import { CancelButton, DeleteButton, SubmitButton } from '@/components/ui/forms/button/button';
import { NormalForm } from '@/components/ui/forms/form/form';

export default function EditServer({ server, menuOpen, setMenuOpen } : { server: ServerT, menuOpen: boolean, setMenuOpen: Dispatch<SetStateAction<boolean>> }) {
    const [serverName, setServerName] = useState<string>(server.name);
    const [serverNameValid, setServerNameValid] = useState<boolean>();

    const [serverImage, setServerImage] = useState<File>();

    const [submitted, setSubmitted] = useState<boolean>();

    const valid = serverNameValid;

    const client = useQueryClient();
    const { mutate } = editServerMutation(client, server.serverId, CLIENT_ID);

    const handleDeleteServer = async () => {
        /*await deleteChannel(channel.channelId);
        invalidateChannels(selectedServerId);

        if (selectedChannelId === channel.channelId) {
            const next = channels.find((channel) => channel.channelId !== selectedChannelId);
            router.push((next) ? `/home/${selectedServerId}/${next.channelId}` : `/home/${selectedServerId}/empty`);
        } else {
            router.refresh();
        }*/
    };

    const handleServerEdit = () => {
        if (serverName === server.name && !serverImage) {
            setMenuOpen(false);
            return;
        }

        mutate({
            name: serverName,
            imageFile: serverImage || null
        });

        setMenuOpen(false);
    };

    return (
        <Popup open={menuOpen}>
            <NormalForm>
                <TitleSection title={server.name} icon={Settings} />
                <ImageUpload existingImageId={server.imageId} existingImageLocation={S3Keys.serverImgs} title={'Server Icon'} maxSize={maxFileSize} file={serverImage} setFile={setServerImage} onInvalid={(message) => console.log(message)} />
                <TextBox value={serverName} setValue={setServerName} title={'Server Name'} placeholder={'Server name...'} maxChars={maxServerNameLength} submitted={submitted} setValid={setServerNameValid} />
                <ButtonSection>
                    <DeleteButton 
                        onClick={() => {
                            setMenuOpen(false)
                            handleDeleteServer();
                        }}
                        text={'Delete Server'}
                    />
                    <CancelButton onClick={() => setMenuOpen(false)} />
                    <SubmitButton onClick={handleServerEdit} enabled={valid} />
                </ButtonSection>
            </NormalForm>
        </Popup>
    )
}