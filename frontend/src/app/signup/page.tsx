'use client';

import ThemeToggle from '@/components/theme_toggle/theme_toggle';
import { SubmitButton } from '@/components/ui/forms/button/button';
import ImageUpload from '@/components/ui/forms/file_upload/image_upload';
import { NormalForm } from '@/components/ui/forms/form/form';
import TextBox from '@/components/ui/forms/text_box/text_box';
import { createLoginUrl } from '@/lib/auth/auth';
import { useCreateProfileMutation } from '@/lib/mutations/create_profile';
import { useIsMyProfileCompleteQuery } from '@/lib/queries/is_my_profile_complete_query';
import { useQueryClient } from '@tanstack/react-query';
import { BookCheck } from 'lucide-react';
import {
    maxFileSize,
    maxUserNameLength,
    S3Keys
} from 'models';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getClientId } from '../actions';

export default function SignupPage() {
    const router = useRouter();

    const [userName, setUserName] = useState<string>('');
    const [userNameValid, setUserNameValid] = useState<boolean>();

    const [userBio, setUserBio] = useState<string>('');
    const [userBioValid, setUserBioValid] = useState<boolean>();

    const [userImage, setUserImage] = useState<File>();

    const [submitted] = useState<boolean>();

    const valid = userNameValid && userBioValid;

    const client = useQueryClient();
    const { mutate } = useCreateProfileMutation(client, '/home');

    const { data } = useIsMyProfileCompleteQuery();

    useEffect(() => {
        if (data?.complete) {
            router.push('/home');
        }
    }, [data, router]);

    const handleProfileCreate = () => {
        mutate({
            name: userName,
            bio: userBio,
            imageFile: userImage || null,
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
                        <ImageUpload
                            existingImageId={null}
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
                            optional={true}
                            submitted={submitted}
                            setValid={setUserBioValid}
                        />
                        <div className="flex items-center p-3">
                            <div className="flex gap-1">
                                <p className="text-fg-medium text-xs">{data.email}</p>
                                <button
                                    onClick={async () => {
                                        window.location.href = await createLoginUrl(
                                            await getClientId(),
                                            true,
                                        );
                                    }}
                                    className="text-fg-medium text-xs underline"
                                >
                                    Log out
                                </button>
                            </div>
                            <div className="flex grow justify-end">
                                <SubmitButton
                                    onClick={handleProfileCreate}
                                    enabled={valid}
                                    text={'Continue'}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </NormalForm>
        </div>
    );
}
