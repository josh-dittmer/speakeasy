import { deleteChannel } from '@/lib/api/requests';
import { editChannelMutation } from '@/lib/mutations/edit_channel';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { ChangeEvent, createRef, Dispatch, SetStateAction, useState } from 'react';
import { allowedImageMimes, ChannelArrayT, ChannelT, FileT, maxChannelNameLength, maxFileSize, maxServerNameLength, S3Keys, ServerT } from 'models';
import Popup from '@/components/ui/popup/popup';
import { Plus, Settings, Trash } from 'lucide-react';
import { editServerMutation } from '@/lib/mutations/edit_server';
import Image from 'next/image';
import { getFileQuery } from '@/lib/queries/get_file';
import { createServerMutation } from '@/lib/mutations/create_server';
import { CLIENT_ID } from '@/lib/util/client_id';
import TitleSection from '@/components/ui/forms/section/title_section';
import ImageUpload from '@/components/ui/forms/file_upload/image_upload';
import TextBox from '@/components/ui/forms/text_box/text_box';
import ButtonSection from '@/components/ui/forms/section/button_section';
import { CancelButton, SubmitButton } from '@/components/ui/forms/button/button';
import { NormalForm } from '@/components/ui/forms/form/form';

export default function CreateServer({ menuOpen, setMenuOpen } : { menuOpen: boolean, setMenuOpen: Dispatch<SetStateAction<boolean>> }) {
    const [serverName, setServerName] = useState<string>('');
    const [serverNameValid, setServerNameValid] = useState<boolean>();

    const [serverImage, setServerImage] = useState<File>();

    const [submitted, setSubmitted] = useState<boolean>();

    const valid = serverNameValid;

    const client = useQueryClient();
    const { mutate } = createServerMutation(client, CLIENT_ID);

    const handleServerCreate = () => {
        mutate({
            name: serverName,
            imageFile: serverImage || null
        });

        setServerName('');
        setServerImage(undefined);

        setMenuOpen(false);
    };

    return (
        <Popup open={menuOpen}>
            <NormalForm>
                <TitleSection title={'New Server'} icon={Plus} />
                <ImageUpload existingImageId={null} existingImageLocation={S3Keys.serverImgs} title={'Server Icon'} maxSize={maxFileSize} file={serverImage} setFile={setServerImage} onInvalid={(message) => console.log(message)} />
                <TextBox value={serverName} setValue={setServerName} title={'Server Name'} placeholder={'Server name...'} maxChars={maxServerNameLength} submitted={submitted} setValid={setServerNameValid} />
                <ButtonSection>
                    <CancelButton onClick={() => setMenuOpen(false)} />
                    <SubmitButton onClick={handleServerCreate} enabled={valid} />
                </ButtonSection>
            </NormalForm>
        </Popup>
    )
}