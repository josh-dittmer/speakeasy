import Menu, { MenuItem, MenuSeparator, MenuUp } from "@/components/ui/menu/menu";
import { LogOut, Pencil, Plus, Settings, Trash, Users } from "lucide-react";
import { ChangeEvent, createRef, Dispatch, SetStateAction, useMemo, useState } from "react";
import { allowedImageMimes, maxFileSize, maxUserBioLength, maxUserNameLength, S3Keys, ServerT, UserT } from "models";
import { useQueryClient } from "@tanstack/react-query";
import { editProfileMutation } from "@/lib/mutations/edit_profile";
import Image from "next/image";
import { getFileQuery } from "@/lib/queries/get_file";
import { usePathname, useRouter } from "next/navigation";
import { handleRevokeTokens } from "@/lib/auth/auth";
import { getClientId } from "@/app/actions";
import { CLIENT_ID } from "@/lib/util/client_id";
import ImageUpload from "@/components/ui/forms/file_upload/image_upload";
import TextBox from "@/components/ui/forms/text_box/text_box";
import { SmallForm } from "@/components/ui/forms/form/form";
import { SubmitButton } from "@/components/ui/forms/button/button";

export default function ProfileMenu({ user, open, setOpen }: { user: UserT, open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {
    //const selectedServerId = usePathname().split('/')[2];
    
    const [userName, setUserName] = useState<string>(user.name);
    const [userNameValid, setUserNameValid] = useState<boolean>();

    const [userBio, setUserBio] = useState<string>(user.bio || '');
    const [userBioValid, setUserBioValid] = useState<boolean>();

    const [userImage, setUserImage] = useState<File>();

    const [submitted, setSubmitted] = useState<boolean>();

    const valid = userNameValid && userBioValid;

    const client = useQueryClient();
    const { mutate } = editProfileMutation(client, CLIENT_ID);

    const router = useRouter();

    const handleProfileSave = () => {
        if (userName === user.name && userBio === user.bio && !userImage) {
            setOpen(false);
            return;
        }

        mutate({
            name: userName,
            bio: userBio,
            imageFile: userImage || null
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
                    <ImageUpload existingImageId={user.imageId} existingImageLocation={S3Keys.profileImgs} title={'Profile Picture'} maxSize={maxFileSize} file={userImage} setFile={setUserImage} onInvalid={(message) => console.log(message)} />
                    <TextBox value={userName} setValue={setUserName} title={'Name'} placeholder={'Name...'} maxChars={maxUserNameLength} hideCount={true} submitted={submitted} setValid={setUserNameValid} />
                    <TextBox value={userBio} setValue={setUserBio} title={'Bio (optional)'} multiline={true} placeholder={'Bio...'} maxChars={maxUserNameLength} hideCount={true} optional={true} submitted={submitted} setValid={setUserBioValid} />
                    <div className="grow flex justify-between p-1">
                        <div className="flex gap-1 items-center text-red-600 hover:text-red-800">
                            <LogOut width={10} height={10} className="" />
                            <button
                                onClick={() => handleLogout()}
                                className="text-xs"
                            >
                                Log Out
                            </button>
                        </div>
                        <SubmitButton onClick={handleProfileSave} text={'Save'} enabled={valid} />
                    </div>
                </SmallForm>
            </MenuUp>
        </>
    )
}