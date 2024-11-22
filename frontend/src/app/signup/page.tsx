'use client';

import { deleteChannel, isMyProfileComplete } from '@/lib/api/requests';
import { editChannelMutation } from '@/lib/mutations/edit_channel';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { ChangeEvent, createRef, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { allowedImageMimes, ChannelArrayT, ChannelT, FileT, maxChannelNameLength, maxFileSize, maxServerNameLength, S3Keys, ServerT } from 'models';
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

function ServerImage({ newImageFile }: { newImageFile: File | undefined }) {    
    if (!newImageFile) {
        return (
            <div className="w-[100px] h-[100px] rounded-full border-2 border-fg-light bg-bg-light flex justify-center items-center">
                <Plus width={32} height={32} className="text-fg-dark" />
            </div>
        )
    }

    return (
        <Image
            src={URL.createObjectURL(newImageFile)}
            width={0}
            height={0}
            sizes="100vw"
            className="w-[100px] h-[100px] rounded-full border-2 border-fg-light"
            alt="Server image"
        />
    )
}

export default function SignupPage() {
    const router = useRouter();

    const [userName, setUserName] = useState<string>('');
    const [userBio, setUserBio] = useState<string>('');

    const [userImage, setUserImage] = useState<File>();
    const userImageRef = createRef<HTMLInputElement>()

    const client = useQueryClient();
    const { mutate } = createProfileMutation(client, '/home');

    const { data } = isMyProfileCompleteQuery();

    useEffect(() => {
        if (data?.complete) {
            router.push('/home');
        }
    }, [data]);

    const handleServerCreate = () => {
        if (userName.length < maxServerNameLength && userName.length > 0) {
            mutate({
                name: userName,
                bio: userBio,
                imageFile: userImage || null
            });
        } else {

        }
    };

    const clearImage = () => {
        if (userImageRef.current) {
            userImageRef.current.value = '';
        }
    }

    const onAddImage = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;
        const file = e.target.files[0];

        if (file.size > maxFileSize) {
            // file too big
            return;
        }

        else if (!allowedImageMimes.includes(file.type)) {
            // file is not a valid image type
            return;
        }

        setUserImage(file);
        clearImage();
    }

    if (!data || data.complete) return;

    return (
        <div className="flex justify-center items-center w-screen h-screen bg-bg-dark">
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
            <div className="w-full flex flex-col items-center p-3">
                <p className="text-fg-medium mb-2">Profile Picture</p>
                <input 
                    type="file"
                    id="file-c-server"
                    ref={userImageRef}
                    onChange={onAddImage}
                    className="hidden"
                />
                <label
                    htmlFor="file-c-server"
                    className=""
                >
                    <ServerImage newImageFile={userImage} />
                </label>
            </div>
            <div className="p-3">
                <p className="text-fg-medium mb-2">Name</p>
                <input 
                    type="text"
                    placeholder="Name..."
                    className="outline-none bg-bg-medium p-2 w-96 rounded text-fg-dark"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
            </div>
            <div className="p-3">
                <p className="text-fg-medium mb-2">Bio (optional)</p>
                <textarea
                        value={userBio}
                        onChange={(e) => setUserBio(e.target.value)}
                        placeholder="Bio..."
                        rows={2}
                        className="outline-none bg-bg-medium p-2 w-96 rounded text-fg-dark resize-none"
                    />
            </div>
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
                    <button
                        onClick={handleServerCreate}
                        className="text-fg-accent bg-bg-accent hover:bg-bg-accent-dark p-2 rounded"
                    >
                        Continue
                    </button>
                </div>
            </div>
            </div>
            </div>
        </div>
    )
}