'use client';


export default function FailedMessage(/*{ messageReq }: { messageReq: CreateMessageRequestT }*/) {
    //console.log(messageReq);
    /*const { data, isSuccess } = getMyUserDataQuery();
    
    const queryClient = useQueryClient();
    const { mutate } = createMessageMutation(queryClient, messageReq.channelId);

    return (
        <div className="flex ml-5 mb-5 truncate">
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
                    <p className="text-sm text-fg-dark max-w-xl text-wrap break-all">FAILED TO DELIVER: {messageReq.content}</p>
                </div>
            </div>
        </div>
    )*/
    return <p>Error</p>
}
