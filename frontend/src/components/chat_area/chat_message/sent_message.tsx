import { MessageT, UserT } from 'models';
import Image from 'next/image';

export default function SentMessage({ message, user }: { message: MessageT, user: UserT | undefined }) {
    return (
        <div className="flex ml-5 mb-5 truncate">
            <div className="shrink-0">
                <Image 
                    src={'/img/profile_pic.jpg'} 
                    width={45} 
                    height={45} 
                    alt="Profile picture" 
                    className="object-cover rounded-full"
                />
            </div>
            <div className="ml-3">
                <div className="flex items-center">
                    <p className="text-sm text-fg-dark font-bold">{user?.name}</p>
                    <p className="ml-3 text-xs text-fg-light">{message.date}</p>
                </div>
                <div className="mt-1">
                <p className="text-sm text-fg-dark max-w-xl text-wrap break-all">{message.content}</p>
                </div>
            </div>
        </div>
    )
}