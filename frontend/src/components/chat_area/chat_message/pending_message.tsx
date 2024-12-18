'use client';

import Image from 'next/image';

export default function PendingMessage(/*{ messageReq }: { messageReq: CreateMessageRequestT }*/) {
    //console.log(messageReq);
    /*const { data, isSuccess } = getMyUserDataQuery();
    
    return (
        <div className="flex ml-5 mb-5 truncate opacity-50">
            <div className="shrink-0">
                <Image 
                    src={'/img/profile_pic.jpg'} 
                    width={45} 
                    height={45} 
                    alt="Profile picture" 
                    className="object-cover rounded-full w-[45px] h-[45px]"
                />
            </div>
            <div className="ml-3">
                <div className="flex items-center">
                    <p className="text-sm text-fg-dark font-bold">
                        {isSuccess && (
                            data.name
                        )}
                    </p>
                    <p className="ml-3 text-xs text-fg-light"></p>
                </div>
                <div className="mt-1">
                    <p className="text-sm text-fg-dark max-w-xl text-wrap break-all">{messageReq.content}</p>
                </div>
            </div>
        </div>
    )*/
    return (
        <div className="ml-4">
            <Image
                src={'/img/image_loading.gif'}
                width={32}
                height={32}
                //sizes="100vw"
                //className="w-8 h-8"
                alt="Message sending"
            />
        </div>
    );
}
