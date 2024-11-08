import ChannelBar from "@/components/channel_bar/channel_bar";
import UserBar from "@/components/user_bar/user_bar";
import { getServerData } from "@/lib/api/requests"
import { ServerDataT } from "models"

export default async function ServerLayout({ params, children }: Readonly<{ params: { serverId: string }, children: React.ReactNode }>) {
    const serverData: ServerDataT = await getServerData(params.serverId);
    
    return (
        <>
            <ChannelBar channels={serverData.channels} server={serverData.server} />
            {children}
            <UserBar users={serverData.users} />
        </>
    )
}