'use client';

import { deleteChannel, isMyProfileComplete } from '@/lib/api/requests';
import { editChannelMutation } from '@/lib/mutations/edit_channel';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { ChangeEvent, createRef, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { allowedImageMimes, ChannelArrayT, ChannelT, FileT, maxChannelNameLength, maxFileSize, maxServerNameLength, maxUserNameLength, S3Keys, ServerT } from 'models';
import Popup from '@/components/ui/popup/popup';
import { BookCheck, Check, Plus, Settings, Trash } from 'lucide-react';
import { editServerMutation } from '@/lib/mutations/edit_server';
import Image from 'next/image';
import { getFileQuery } from '@/lib/queries/get_file';
import { createServerMutation } from '@/lib/mutations/create_server';
import ThemeToggle from '@/components/theme_toggle/theme_toggle';
import { isMyProfileCompleteQuery } from '@/lib/queries/is_my_profile_complete_query';
import { createProfileMutation } from '@/lib/mutations/create_profile';
import { createLoginUrl } from '@/lib/auth/auth';
import { getClientId } from '../actions';
import ImageUpload from '@/components/ui/forms/file_upload/image_upload';
import TextBox from '@/components/ui/forms/text_box/text_box';
import { SubmitButton } from '@/components/ui/forms/button/button';
import { NormalForm } from '@/components/ui/forms/form/form';

export default function SignupPage() {
    const router = useRouter();

    const [userName, setUserName] = useState<string>('');
    const [userNameValid, setUserNameValid] = useState<boolean>();

    const [userBio, setUserBio] = useState<string>('');
    const [userBioValid, setUserBioValid] = useState<boolean>();

    const [userImage, setUserImage] = useState<File>();

    const [submitted, setSubmitted] = useState<boolean>();

    const valid = userNameValid && userBioValid;

    const client = useQueryClient();
    const { mutate } = createProfileMutation(client, '/home');

    const { data } = isMyProfileCompleteQuery();

    useEffect(() => {
        if (data?.complete) {
            router.push('/home');
        }
    }, [data]);

    const handleProfileCreate = () => {
        mutate({
            name: userName,
            bio: userBio,
            imageFile: userImage || null
        });
    };

    if (!data || data.complete) return;

    return (
        <div className="flex justify-center items-center w-screen h-screen bg-bg-dark">
            <NormalForm>
                <div className="bg-bg-light rounded-xl">
                    <div className="p-3 shadow-b">
                        <div className="flex items-center p-3">
                            <BookCheck width={25} height={25} className="text-fg-medium" />
                            <h1 className="ml-3 text-fg-dark text-2xl">Complete Profile</h1>
                            <div className="grow flex justify-end items-center">
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                    <div className="p-3">
                        <ImageUpload existingImageId={null} existingImageLocation={S3Keys.profileImgs} title={'Profile Picture'} maxSize={maxFileSize} file={userImage} setFile={setUserImage} onInvalid={(message) => console.log(message)} />
                        <TextBox value={userName} setValue={setUserName} title={'Name'} placeholder={'Name...'} maxChars={maxUserNameLength} submitted={submitted} setValid={setUserNameValid} />
                        <TextBox value={userBio} setValue={setUserBio} title={'Bio (optional)'} multiline={true} placeholder={'Bio...'} maxChars={maxUserNameLength} optional={true} submitted={submitted} setValid={setUserBioValid} />
                        <div className="flex items-center p-3">
                            <div className="flex gap-1">
                                <p className="text-fg-medium text-xs">{data.email}</p>
                                <button
                                    onClick={async () => {
                                        window.location.href = await createLoginUrl(await getClientId(), true);
                                    }}
                                    className="text-fg-medium text-xs underline"
                                >
                                    Log out
                                </button>
                            </div>
                            <div className="flex grow justify-end">
                                <SubmitButton onClick={handleProfileCreate} enabled={valid} text={'Continue'} />
                            </div>
                        </div>
                    </div>
                </div>
            </NormalForm>
        </div>
    )
}