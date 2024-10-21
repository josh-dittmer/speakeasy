import ServerBar from '@/components/server_bar';
import { getServerList } from '@/lib/requests';

export default async function ServerLayout({ params, children }: Readonly<{ params: { serverId: string }, children: React.ReactNode; }>) { 
    const servers = await getServerList();

    return (
        <>
            <div>
                <ServerBar servers={servers} selectedServerId={params.serverId} />
            </div>
            {children}
        </>
    );
  }