import ChannelBar from "@/components/channel_bar";
import UserBar from "@/components/user_bar";
import { getServerData } from "@/lib/requests"
import { ServerDataT } from "models"

export default async function ServerLayout({ params, children }: Readonly<{ params: { serverId: string }, children: React.ReactNode }>) {
    const serverData: ServerDataT = await getServerData(params.serverId);
    
    return (
        <>
            <ChannelBar channels={serverData.channels} serverName={serverData.server.name} />
            {children}
            <UserBar users={serverData.users} />
        </>
    )
}