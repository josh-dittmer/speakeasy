import { useGetFileQuery } from '@/lib/queries/get_file';
import { S3Keys } from 'models';
import Image from 'next/image';
import { useMemo } from 'react';

function ProfileImageWithoutFile({ name, className }: { name: string, className: string }) {
    return (
        <div className={`w-11 h-11 rounded-full flex items-center justify-center ${className}`}>
            <p className="text-fg-dark">{name[0]}</p>
        </div>
    );
}

function ProfileImageWithFile({ imageId, className }: { imageId: string, className: string }) {
    const { data, isLoading, isSuccess, isError } = useGetFileQuery(S3Keys.profileImgs, imageId);
    const url = useMemo(() => (data ? URL.createObjectURL(data) : undefined), [data]);

    if (isError) {
        return <p>ERROR</p>;
    }

    return (
        <div className={`flex items-center justify-center rounded-full ${className}`}>
            {isLoading && (
                <Image
                    src={'/img/image_loading.gif'}
                    width={44}
                    height={44}
                    //sizes="100vw"
                    //className={`w-11 h-11 rounded-full`}
                    className={`rounded-full`}
                    alt="User image loading"
                />
            )}
            {url && isSuccess && (
                <Image
                    src={url}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className={`w-11 h-11 rounded-full`}
                    //className={`rounded-full`}
                    alt="User image"
                />
            )}
        </div>
    );
}

export default function ProfileImage({
    name,
    imageId,
    className,
}: {
    name: string;
    imageId: string | null;
    className: string;
}) {
    if (!imageId) {
        return <ProfileImageWithoutFile name={name} className={className} />
    }

    return <ProfileImageWithFile imageId={imageId} className={className} />
}
