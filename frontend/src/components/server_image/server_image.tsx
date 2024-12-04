import { useGetFileQuery } from "@/lib/queries/get_file";
import { S3Keys } from "models";
import Image from "next/image";

function ServerImageWithoutFile({ serverName }: { serverName: string }) {
    return (
        <div className="server-icon">
            <div className="w-16 h-16 flex justify-center items-center">
                <p className="">{serverName[0]}</p>
            </div>
        </div>
    );
}

function ServerImageWithFile({ imageId }: { imageId: string }) {
    const { data, isLoading, isError, isSuccess } = useGetFileQuery(S3Keys.serverImgs, imageId);

    if (isError) {
        return <p>FAILED TO LOAD FILE</p>;
    }

    return (
        <div className="server-icon overflow-hidden">
            <div className="w-16 h-16 flex justify-center items-center">
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
                {isSuccess && (
                    <Image
                        src={URL.createObjectURL(data)}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-16 h-16"
                        alt="Server image"
                    />
                )}
            </div>
        </div>
    );
}

export default function ServerImage({ serverName, imageId }: { serverName: string; imageId: string | null }) {
    if (!imageId) {
        return <ServerImageWithoutFile serverName={serverName} />
    }

    return <ServerImageWithFile imageId={imageId} />
}