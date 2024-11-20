import ServerBar from '@/components/server_bar/server_bar';
import { getServerList } from '@/lib/api/requests';
import { ServerArrayT } from 'models';

import './css/layout.css';
import { getServerListQuery } from '@/lib/queries/get_server_list';

export default async function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="home-layout">
            <ServerBar />
            {children}
        </div>
    )
}