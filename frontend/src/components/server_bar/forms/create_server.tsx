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
import { invalidateServers } from '../actions';

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

export default function CreateServer({ menuOpen, setMenuOpen } : { menuOpen: boolean, setMenuOpen: Dispatch<SetStateAction<boolean>> }) {
    const [serverName, setServerName] = useState<string>('');

    const [serverImage, setServerImage] = useState<File>();
    const serverImageRef = createRef<HTMLInputElement>()

    const client = useQueryClient();
    const { mutate } = createServerMutation(client);

    const handleServerCreate = () => {
        if (serverName.length < maxServerNameLength && serverName.length > 0) {
            invalidateServers();
            mutate({
                name: serverName,
                imageFile: serverImage || null
            });
            setMenuOpen(false);
        } else {

        }
    };

    const clearImage = () => {
        if (serverImageRef.current) {
            serverImageRef.current.value = '';
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

        setServerImage(file);
        clearImage();
    }

    return (
        <Popup open={menuOpen}>
            <div className="flex items-center p-3">
                <Plus width={25} height={25} className="text-fg-medium" />
                <h1 className="ml-3 text-fg-dark text-2xl">New Server</h1>
            </div>
            <div className="w-full flex flex-col items-center p-3">
                <p className="text-fg-medium mb-2">Server Icon</p>
                <input 
                    type="file"
                    id="file"
                    ref={serverImageRef}
                    onChange={onAddImage}
                    className="hidden"
                />
                <label
                    htmlFor="file"
                    className=""
                >
                    <ServerImage newImageFile={serverImage} />
                </label>
            </div>
            <div className="p-3">
                <p className="text-fg-medium mb-2">Server Name</p>
                <input 
                    type="text"
                    placeholder="Server name..."
                    className="outline-none bg-bg-medium p-2 w-96 rounded text-fg-dark"
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                />
            </div>
            <div className="flex items-center p-3">
                <div className="flex grow justify-end">
                    <button
                        onClick={() => {
                            setServerImage(undefined);
                            clearImage();
                            setMenuOpen(false);
                        }}
                        className="text-fg-dark bg-bg-light hover:bg-bg-medium p-2 rounded mr-3"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleServerCreate}
                        className="text-fg-accent bg-bg-accent hover:bg-bg-accent-dark p-2 rounded"
                    >
                        Save
                    </button>
                </div>
            </div>
        </Popup>
    )
}