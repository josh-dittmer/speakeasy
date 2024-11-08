'use client';

import Image from 'next/image';
import { ServerT, ServerArrayT, S3Keys } from 'models';

import './server_bar.css';
import { usePathname } from 'next/navigation';
import { visitServer } from './actions';
import { Plus } from 'lucide-react';
import { getFileQuery } from '@/lib/queries/get_file';
import { useState } from 'react';
import CreateServer from './forms/create_server';

function ServerImage({ serverName, imageId }: { serverName: string, imageId: string | null }) {    
    if (!imageId) {
        return (
            <div className="server-icon">
                <div className="w-16 h-16 flex justify-center items-center">
                    <p className="">{serverName[0]}</p>
                </div>
            </div>
        )
    }

    const { data, isLoading, isError, isSuccess } = getFileQuery(S3Keys.serverImgs, imageId);


    if (isError) {
        return (
            <p>FAILED TO LOAD FILE</p>
        )
    }

    return (
        <div className="server-icon overflow-hidden">
            <div className="w-16 h-16 flex justify-center items-center">
                {isLoading && (
                    <Image
                        src={'/img/image_loading.gif'}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-16 h-16"
                        alt="Server image loading"
                    />
                )}
                {isSuccess && (
                    <Image
                        src={URL.createObjectURL(data)}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-16 h-16"
                        alt="Server image"
                    />
                )}
            </div>
        </div>
    )
}

function ServerIcon({ server, selected } : { server: ServerT, selected: boolean }) {    
    return (
        <div className={(selected ? 'selected-server-div' : 'server-div') + " flex items-center p-2 pl-0"}>
            <div className="relative w-1 h-8 mr-2 rounded-r-lg server-indicator"></div>
            <button onClick={() => visitServer(server.serverId)}>
            <div className="">
                    <ServerImage serverName={server.name} imageId={server.imageId} />
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
    
    const [createServerOpen, setCreateServerOpen] = useState<boolean>(false);

    return (
        <div className="bg-bg-dark shadow-all h-screen overflow-y-scroll">
            <div className="server-div flex items-center p-2 pl-0">
                <div className="relative w-1 h-8 mr-2 rounded-r-lg server-indicator"></div>
                <button onClick={() => setCreateServerOpen(true)}>
                <div className="server-icon">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center">
                        <Plus width={25} height={25} className="text-fg-dark" />
                    </div>
                </div>
                </button>
                <div className="server-nameplate absolute left-24 z-10 bg-bg-light p-2 rounded font-bold shadow-all">
                    <p className="text-fg-dark">New Server</p>
                </div>
            </div>
            {servers.map((server) => {
                return <ServerIcon key={server.serverId} server={server} selected={server.serverId === selectedServerId} />
            })}
            <CreateServer menuOpen={createServerOpen} setMenuOpen={setCreateServerOpen} />
        </div>
    )
}