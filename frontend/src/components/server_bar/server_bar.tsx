'use client';

import { ServerT } from 'models';

import useVisitServer from '@/hooks/visit_server';
import { useGetServerListQuery } from '@/lib/queries/get_server_list';
import { Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import ServerImage from '../server_image/server_image';
import CreateServer from './forms/create_server';
import './server_bar.css';

function ServerIcon({ server, selected }: { server: ServerT; selected: boolean }) {
    const { visitServer } = useVisitServer(server.serverId);

    return (
        <div
            className={
                (selected ? 'selected-server-div' : 'server-div') + ' flex items-center p-2 pl-0'
            }
        >
            <div className="relative w-1 h-8 mr-2 rounded-r-lg server-indicator"></div>
            <button onClick={() => visitServer()}>
                <div className="">
                    <ServerImage serverName={server.name} imageId={server.imageId} />
                </div>
            </button>
            <div className="server-nameplate absolute left-24 z-10 bg-bg-light p-2 rounded font-bold shadow-all">
                <p className="text-fg-dark">{server.name}</p>
            </div>
        </div>
    );
}

export default function ServerBar() {
    const selectedServerId = usePathname().split('/')[2];

    const { data } = useGetServerListQuery();

    const [createServerOpen, setCreateServerOpen] = useState<boolean>(false);

    return (
        <div className="bg-bg-dark shadow-all h-screen overflow-y-scroll">
            <div className="server-div flex items-center p-2 pl-0">
                <div className="relative w-1 h-8 mr-2 rounded-r-lg server-indicator"></div>
                <button onClick={() => setCreateServerOpen(true)}>
                    <div className="server-icon">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center">
                            <Plus width={25} height={25} className="" />
                        </div>
                    </div>
                </button>
                <div className="server-nameplate absolute left-24 z-10 bg-bg-light p-2 rounded font-bold shadow-all">
                    <p className="text-fg-dark">New Server</p>
                </div>
            </div>
            {data?.map(server => {
                return (
                    <ServerIcon
                        key={server.serverId}
                        server={server}
                        selected={server.serverId === selectedServerId}
                    />
                );
            })}
            <CreateServer menuOpen={createServerOpen} setMenuOpen={setCreateServerOpen} />
        </div>
    );
}
