import ServerBar from '@/components/server_bar/server_bar';
import { getServerList } from '@/lib/api/requests';

export default async function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const servers = await getServerList();
    
    return (
        <div className="flex">
            <ServerBar servers={servers} />
            {children}
        </div>
    )
}