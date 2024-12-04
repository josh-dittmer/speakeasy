import { useGetFileQuery } from '@/lib/queries/get_file';
import { Plus } from 'lucide-react';
import { allowedImageMimes } from 'models';
import Image from 'next/image';
import { ChangeEvent, createRef, useMemo } from 'react';

import './image_upload.css';

function NewImagePreview({ imageFile }: { imageFile: File }) {
    return (
        <Image
            src={URL.createObjectURL(imageFile)}
            width={0}
            height={0}
            sizes="100vw"
            className="image-preview rounded-full border-2 border-fg-light"
            alt="Image"
        />
    );
}

function ExistingImagePreview({
    imageId,
    imageLocation,
}: {
    imageId: string;
    imageLocation: string;
}) {
    const { data, isLoading, isError } = useGetFileQuery(imageLocation, imageId);

    const imageUrl = useMemo(() => (data ? URL.createObjectURL(data) : null), [data]);

    return (
        <>
            {isLoading && (
                <Image
                    src={'/img/image_loading.gif'}
                    width={64}
                    height={64}
                    //sizes="100vw"
                    //className="w-16 h-16"
                    alt="Server image loading"
                />
            )}
            {isError && <p>FAILED TO LOAD FILE</p>}
            {data && imageUrl && (
                <Image
                    src={imageUrl}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="image-preview rounded-full border-2 border-fg-light"
                    alt="Image"
                />
            )}
        </>
    );
}

function ConditionalImagePreview({
    existingImageId,
    existingImageLocation,
    newImageFile,
}: {
    existingImageId: string | null;
    existingImageLocation: string;
    newImageFile: File | undefined;
}) {
    if (newImageFile) {
        return <NewImagePreview imageFile={newImageFile} />;
    }

    if (!existingImageId) {
        return (
            <div className="image-preview rounded-full border-2 border-fg-light bg-bg-light flex justify-center items-center">
                <Plus width={32} height={32} className="text-fg-dark" />
            </div>
        );
    }

    return <ExistingImagePreview imageId={existingImageId} imageLocation={existingImageLocation} />;
}

type ImageUploadProps = {
    existingImageId: string | null;
    existingImageLocation: string;
    title: string;
    maxSize: number;
    file: File | undefined;
    setFile: (file: File) => void;
    onInvalid: (message: string) => void;
};

export default function ImageUpload({
    existingImageId,
    existingImageLocation,
    title,
    maxSize,
    file,
    setFile,
    onInvalid,
}: ImageUploadProps) {
    const inputRef = createRef<HTMLInputElement>();

    const clearFile = () => {
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const onFileAdded = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) {
            return;
        }

        const file = e.target.files[0];

        if (file.size > maxSize) {
            onInvalid(
                `The selected file is too big! The maximum allowed size is ${maxSize} bytes.`,
            );
        } else if (!allowedImageMimes.includes(file.type)) {
            onInvalid('The selected file type is not allowed!');
        } else {
            setFile(file);
            clearFile();
        }
    };

    return (
        <div className="w-full flex flex-col items-center p-3">
            <p className="text-fg-medium mb-2">{title}</p>
            <input
                type="file"
                id="file-input"
                ref={inputRef}
                onChange={onFileAdded}
                className="hidden"
            />
            <label htmlFor="file-input" className="">
                <ConditionalImagePreview
                    existingImageId={existingImageId}
                    existingImageLocation={existingImageLocation}
                    newImageFile={file}
                />
            </label>
        </div>
    );
}
