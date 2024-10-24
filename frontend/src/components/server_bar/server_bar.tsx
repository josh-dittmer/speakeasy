'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ServerT, ServerArrayT } from 'models';

import './server_bar.css';
import { usePathname } from 'next/navigation';

function ServerIcon({ server, selected } : { server: ServerT, selected: boolean }) {
    return (
        <div className={(selected ? 'selected-server-div' : 'server-div') + " flex items-center p-2 pl-0"}>
            <div className="relative w-1 h-8 mr-2 rounded-r-lg server-indicator"></div>
            <Link href={`/home/${server.serverId}`}>
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
            </Link>
            <div className="server-nameplate absolute left-24 z-10 bg-white p-2 rounded font-bold shadow-all">
                <p>{server.name}</p>
            </div>
        </div>
    )
}

export default function ServerBar({ servers } : { servers: ServerArrayT }) { 
    const selectedServerId = usePathname().split('/')[2];
    
    return (
        <div className="bg-slate-200 shadow-all h-screen overflow-y-scroll">
            {servers.map((server, index) => {
                return <ServerIcon key={index} server={server} selected={server.serverId === selectedServerId} />
            })}
        </div>
    )
}