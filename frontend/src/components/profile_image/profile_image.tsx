import { getFileQuery } from '@/lib/queries/get_file';
import { S3Keys } from 'models';
import Image from 'next/image';
import { useMemo } from 'react';

export default function ProfileImage({ name, imageId, className }: { name: string, imageId: string | null, className: string }) {    
    if (!imageId) {
        return (
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${className}`}>
                <p className="text-fg-dark">{name[0]}</p>
            </div>
        )
    }

    const { data, isLoading, isSuccess, isError } = getFileQuery(S3Keys.profileImgs, imageId);
    const url = useMemo(() => (data) ? URL.createObjectURL(data) : undefined, [data]);

    if (isError) {
        return (
            <p>ERROR</p>
        )
    }

    if (!data || !url) return;

    return (
        <div className={`flex items-center justify-center rounded-full ${className}`}>
            {isLoading && (
                <Image
                    src={'/img/image_loading.gif'}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className={`w-12 h-12 rounded-full`}
                    alt="User image loading"
                />
            )}
            {isSuccess && (
                <Image
                    src={url}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className={`w-12 h-12 rounded-full`}
                    alt="User image"
                />
            )}
        </div>
    )
}