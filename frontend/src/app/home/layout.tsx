import ServerBar from '@/components/server_bar/server_bar';
import { getServerList } from '@/lib/api/requests';
import { ServerArrayT } from 'models';

import './css/layout.css';

export default async function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const servers: ServerArrayT = await getServerList();
    
    return (
        <div className="home-layout">
            <ServerBar servers={servers} />
            {children}
        </div>
    )
}