import ChannelBar from "@/components/channel_bar/channel_bar";
import UserBar from "@/components/user_bar/user_bar";

export default function ServerLayout({ params, children }: Readonly<{ params: { serverId: string }, children: React.ReactNode }>) {
    return (
        <>
            <ChannelBar serverId={params.serverId} />
            {children}
            <UserBar serverId={params.serverId} />
        </>
    )
}