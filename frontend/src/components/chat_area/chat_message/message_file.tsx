import { getFileQuery } from '@/lib/queries/get_file';
import { FileT, S3Keys } from 'models';
import Image from 'next/image';

export default function MessageFile({ file }: { file: FileT }) {
    const { data, isLoading, isError } = getFileQuery(S3Keys.messageFiles, file.fileId);
    
    if (isLoading) {
        return (
            <p>LOADING...</p>
        )
    }

    if (isError) {
        return (
            <p>FAILED TO LOAD FILE</p>
        )
    }

    if (!data) return;

    switch(file.mimeType) {
        case 'image/png':
        case 'image/jpeg':
        case 'image/gif':
            return (
                <div>
                    <Image
                        src={URL.createObjectURL(data)}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full max-w-52 h-auto rounded"
                        alt="Message image"
                    />
                </div>
            )
    }
}