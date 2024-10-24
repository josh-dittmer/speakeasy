'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ServerT, ServerArrayT, ServerDataT } from 'models';

import './server_bar.css';
import { usePathname } from 'next/navigation';
import { getServerData } from '@/lib/api/requests';
import { useRouter } from 'next/navigation';

async function ServerIcon({ server, selected } : { server: ServerT, selected: boolean }) {
    const router = useRouter();
    
    const visitServer = async () => {
        const serverData: ServerDataT = await getServerData(server.serverId);

        // TODO: load last channel from local storage
        const lastChannel = serverData.channels[0];

        router.push(`/home/${server.serverId}/${lastChannel.channelId}`);
    }
    
    return (
        <div className={(selected ? 'selected-server-div' : 'server-div') + " flex items-center p-2 pl-0"}>
            <div className="relative w-1 h-8 mr-2 rounded-r-lg server-indicator"></div>
            <button onClick={visitServer}>
            <div className="flex items-center justify-center w-16 h-16 server-icon">
                    {false ? (
                        <Image 
                            src={server.imageId!} 
                            width={25} 
                            height={25} 
                            alt={server.imageId!} 
                            className=""
                        />
                    ) : (
                        <p className="">{server.name[0]}</p>
                    )}
            </div>
            </button>
            <div className="server-nameplate absolute left-24 z-10 bg-bg-light p-2 rounded font-bold shadow-all">
                <p className="text-fg-dark">{server.name}</p>
            </div>
        </div>
    )
}

export default function ServerBar({ servers } : { servers: ServerArrayT }) { 
    const selectedServerId = usePathname().split('/')[2];
    
    return (
        <div className="bg-bg-dark shadow-all h-screen overflow-y-scroll">
            {servers.map((server) => {
                return <ServerIcon key={server.serverId} server={server} selected={server.serverId === selectedServerId} />
            })}
        </div>
    )
}