import { CancelButton, SubmitButton } from '@/components/ui/forms/button/button';
import ImageUpload from '@/components/ui/forms/file_upload/image_upload';
import { NormalForm } from '@/components/ui/forms/form/form';
import ButtonSection from '@/components/ui/forms/section/button_section';
import TitleSection from '@/components/ui/forms/section/title_section';
import TextBox from '@/components/ui/forms/text_box/text_box';
import Popup from '@/components/ui/popup/popup';
import { useCreateServerMutation } from '@/lib/mutations/create_server';
import { CLIENT_ID } from '@/lib/util/client_id';
import { useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import {
    maxFileSize,
    maxServerNameLength,
    S3Keys
} from 'models';
import { Dispatch, SetStateAction, useState } from 'react';

export default function CreateServer({
    menuOpen,
    setMenuOpen,
}: {
    menuOpen: boolean;
    setMenuOpen: Dispatch<SetStateAction<boolean>>;
}) {
    const [serverName, setServerName] = useState<string>('');
    const [serverNameValid, setServerNameValid] = useState<boolean>();

    const [serverImage, setServerImage] = useState<File>();

    const [submitted] = useState<boolean>();

    const valid = serverNameValid;

    const client = useQueryClient();
    const { mutate } = useCreateServerMutation(client, CLIENT_ID);

    const handleServerCreate = () => {
        mutate({
            name: serverName,
            imageFile: serverImage || null,
        });

        setServerName('');
        setServerImage(undefined);

        setMenuOpen(false);
    };

    return (
        <Popup open={menuOpen}>
            <NormalForm>
                <TitleSection title={'New Server'} icon={Plus} />
                <ImageUpload
                    existingImageId={null}
                    existingImageLocation={S3Keys.serverImgs}
                    title={'Server Icon'}
                    maxSize={maxFileSize}
                    file={serverImage}
                    setFile={setServerImage}
                    onInvalid={message => console.log(message)}
                />
                <TextBox
                    value={serverName}
                    setValue={setServerName}
                    title={'Server Name'}
                    placeholder={'Server name...'}
                    maxChars={maxServerNameLength}
                    submitted={submitted}
                    setValid={setServerNameValid}
                />
                <ButtonSection>
                    <CancelButton onClick={() => setMenuOpen(false)} />
                    <SubmitButton onClick={handleServerCreate} enabled={valid} />
                </ButtonSection>
            </NormalForm>
        </Popup>
    );
}
