import Image from 'next/image';

export default function LoadingSpinner() {
    return (
        <div className="relative h-screen grow flex justify-center items-center">
            <Image src="/img/loading.gif" width={100} height={100} alt="Loading" />
        </div>
    )
}