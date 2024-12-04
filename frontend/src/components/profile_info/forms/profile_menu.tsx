import { getClientId } from '@/app/actions';
import { SubmitButton } from '@/components/ui/forms/button/button';
import ImageUpload from '@/components/ui/forms/file_upload/image_upload';
import { SmallForm } from '@/components/ui/forms/form/form';
import TextBox from '@/components/ui/forms/text_box/text_box';
import { MenuUp } from '@/components/ui/menu/menu';
import { handleRevokeTokens } from '@/lib/auth/auth';
import { useEditProfileMutation } from '@/lib/mutations/edit_profile';
import { CLIENT_ID } from '@/lib/util/client_id';
import { useQueryClient } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import {
    maxFileSize,
    maxUserNameLength,
    S3Keys,
    UserT
} from 'models';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';

export default function ProfileMenu({
    user,
    open,
    setOpen,
}: {
    user: UserT;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}) {
    //const selectedServerId = usePathname().split('/')[2];

    const [userName, setUserName] = useState<string>(user.name);
    const [userNameValid, setUserNameValid] = useState<boolean>();

    const [userBio, setUserBio] = useState<string>(user.bio || '');
    const [userBioValid, setUserBioValid] = useState<boolean>();

    const [userImage, setUserImage] = useState<File>();

    const [submitted] = useState<boolean>();

    const valid = userNameValid && userBioValid;

    const client = useQueryClient();
    const { mutate } = useEditProfileMutation(client, CLIENT_ID);

    const router = useRouter();

    const handleProfileSave = () => {
        if (userName === user.name && userBio === user.bio && !userImage) {
            setOpen(false);
            return;
        }

        mutate({
            name: userName,
            bio: userBio,
            imageFile: userImage || null,
        });

        setUserImage(undefined);
        setOpen(false);
    };

    const handleLogout = async () => {
        await handleRevokeTokens(await getClientId());
        router.push('/login?clear_session=1');
    };

    return (
        <>
            <MenuUp menuState={{ open: open, setOpen: setOpen }}>
                <SmallForm>
                    <ImageUpload
                        existingImageId={user.imageId}
                        existingImageLocation={S3Keys.profileImgs}
                        title={'Profile Picture'}
                        maxSize={maxFileSize}
                        file={userImage}
                        setFile={setUserImage}
                        onInvalid={message => console.log(message)}
                    />
                    <TextBox
                        value={userName}
                        setValue={setUserName}
                        title={'Name'}
                        placeholder={'Name...'}
                        maxChars={maxUserNameLength}
                        hideCount={true}
                        submitted={submitted}
                        setValid={setUserNameValid}
                    />
                    <TextBox
                        value={userBio}
                        setValue={setUserBio}
                        title={'Bio (optional)'}
                        multiline={true}
                        placeholder={'Bio...'}
                        maxChars={maxUserNameLength}
                        hideCount={true}
                        optional={true}
                        submitted={submitted}
                        setValid={setUserBioValid}
                    />
                    <div className="grow flex justify-between p-1">
                        <div className="flex gap-1 items-center text-red-600 hover:text-red-800">
                            <LogOut width={10} height={10} className="" />
                            <button onClick={() => handleLogout()} className="text-xs">
                                Log Out
                            </button>
                        </div>
                        <SubmitButton onClick={handleProfileSave} text={'Save'} enabled={valid} />
                    </div>
                </SmallForm>
            </MenuUp>
        </>
    );
}
