import Menu, { MenuItem, MenuSeparator, MenuUp } from "@/components/ui/menu/menu";
import { LogOut, Pencil, Plus, Settings, Trash, Users } from "lucide-react";
import { ChangeEvent, createRef, Dispatch, SetStateAction, useState } from "react";
import { allowedImageMimes, maxFileSize, maxUserBioLength, maxUserNameLength, S3Keys, ServerT, UserT } from "models";
import { useQueryClient } from "@tanstack/react-query";
import { editProfileMutation } from "@/lib/mutations/edit_profile";
import { invalidateServerData, invalidateUser } from "../actions";
import Image from "next/image";
import { getFileQuery } from "@/lib/queries/get_file";
import { usePathname } from "next/navigation";

function UserImage({ imageId, newImageFile }: { imageId: string | null, newImageFile: File | undefined }) {
    if (newImageFile) {
        return (
            <Image
                src={URL.createObjectURL(newImageFile)}
                width={0}
                height={0}
                sizes="100vw"
                className="w-[75px] h-[75px] rounded-full border-2 border-fg-light"
                alt="User image"
            />
        )
    }
    
    if (!imageId) {
        return (
            <div className="w-[75px] h-[75px] rounded-full border-2 border-fg-light bg-bg-light flex justify-center items-center">
                <Plus width={20} height={20} className="text-fg-dark" />
            </div>
        )
    }

    const { data, isLoading, isError } = getFileQuery(S3Keys.profileImgs, imageId);

    if (isLoading) {
        return (
            <Image
                src={'/img/image_loading.gif'}
                width={0}
                height={0}
                sizes="100vw"
                className="w-16 h-16"
                alt="User image loading"
            />
        )
    }

    if (isError) {
        return (
            <p>FAILED TO LOAD FILE</p>
        )
    }

    if (!data) return;

    return (
        <Image
            src={URL.createObjectURL(data)}
            width={0}
            height={0}
            sizes="100vw"
            className="w-[75px] h-[75px] rounded-full border-2 border-fg-light"
            alt="User image"
        />
    )
}


export default function ProfileMenu({ user, open, setOpen }: { user: UserT, open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {
    const selectedServerId = usePathname().split('/')[2];
    
    const [userName, setUserName] = useState<string>(user.name);
    const [userBio, setUserBio] = useState<string>(user.bio || '');

    const [userImage, setUserImage] = useState<File>();
    const userImageRef = createRef<HTMLInputElement>();

    const client = useQueryClient();
    const { mutate } = editProfileMutation(client);

    const handleProfileSave = () => {
        if (userName === user.name && userBio === user.bio && !userImage) {
            setOpen(false);
            return;
        }

        if (userName.length < maxUserNameLength && userName.length > 0
            && userBio.length < maxUserBioLength && userBio.length > 0
        ) {
            invalidateServerData(selectedServerId);
            invalidateUser();
            mutate({
                name: userName,
                bio: userBio,
                imageFile: userImage || null
            });

            setOpen(false);
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
    };

    return (
        <>
            <MenuUp menuState={{ open: open, setOpen: setOpen }}>
                <div className="w-full flex flex-col items-center p-3">
                    <p className="text-sm text-fg-medium mb-2">Profile Picture</p>
                    <input 
                        type="file"
                        id="file"
                        ref={userImageRef}
                        onChange={onAddImage}
                        className="hidden"
                    />
                    <label
                        htmlFor="file"
                        className=""
                    >
                        <UserImage imageId={user.imageId} newImageFile={userImage} />
                    </label>
                </div>
                <div className="p-1">
                    <p className="text-sm text-fg-medium">Name</p>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Name..."
                        className="p-1 w-full text-sm text-fg-dark bg-bg-medium outline-none rounded"
                    />
                </div>
                <div className="p-1">
                    <p className="text-sm text-fg-medium">Bio</p>
                    <textarea
                        value={userBio}
                        onChange={(e) => setUserBio(e.target.value)}
                        placeholder="Bio..."
                        rows={2}
                        className="p-1 w-full text-sm text-fg-dark bg-bg-medium outline-none rounded resize-none"
                    />
                </div>
                <div className="grow flex justify-end p-1">
                    <button
                        onClick={() => handleProfileSave()}
                        className="text-xs text-fg-accent bg-bg-accent hover:bg-bg-accent-dark p-1 rounded"
                    >
                        Save
                    </button>
                </div>
            </MenuUp>
        </>
    )
}