import { useGetFileQuery } from '@/lib/queries/get_file';
import { FileT, S3Keys } from 'models';
import Image from 'next/image';
import { useMemo } from 'react';

export default function MessageFile({ file }: { file: FileT }) {
    const { data, isLoading, isError } = useGetFileQuery(S3Keys.messageFiles, file.fileId);
    const url = useMemo(() => (data ? URL.createObjectURL(data) : undefined), [data]);

    if (isLoading) {
        return (
            <Image
                src={'/img/image_loading.gif'}
                width={64}
                height={64}
                //sizes="100vw"
                //className="w-16 h-16"
                alt="Server image loading"
            />
        );
    }

    if (isError) {
        return <p>FAILED TO LOAD FILE</p>;
    }

    if (!data || !url) return;

    switch (file.mimeType) {
        case 'image/png':
        case 'image/jpeg':
        case 'image/gif':
            return (
                <div>
                    <Image
                        src={url}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full max-w-52 h-auto rounded"
                        alt="Message image"
                    />
                </div>
            );
        default:
            return <p className="text-red-600">File previews for non-images coming soon!</p>;
    }
}
