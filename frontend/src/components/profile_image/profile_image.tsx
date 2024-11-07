import { getFileQuery } from '@/lib/queries/get_file';
import { S3Keys } from 'models';
import Image from 'next/image';

export default function ProfileImage({ name, imageId, size }: { name: string, imageId: string | null, size: string }) {    
    if (!imageId) {
        return (
            <div className={`w-${size} h-${size} bg-bg-light rounded-full flex items-center justify-center`}>
                <p className="text-fg-dark">{name[0]}</p>
            </div>
        )
    }

    const { data, isLoading, isSuccess, isError } = getFileQuery(S3Keys.profileImgs, imageId);

    if (isError) {
        return (
            <p>ERROR</p>
        )
    }

    return (
        <div className={`bg-bg-light flex items-center justify-center rounded-full`}>
            {isLoading && (
                <Image
                    src={'/img/image_loading.gif'}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className={`w-${size} h-${size} rounded-full`}
                    alt="User image loading"
                />
            )}
            {isSuccess && (
                <Image
                    src={URL.createObjectURL(data)}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className={`w-${size} h-${size} rounded-full`}
                    alt="User image"
                />
            )}
        </div>
    )
}