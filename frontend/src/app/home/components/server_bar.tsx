import Image from 'next/image';

import './server_bar.css';

function ServerIcon({ serverName, serverIconSrc, selected } : { serverName: string, serverIconSrc: string, selected: boolean }) {
    return (
        <div className={(selected ? 'selected-server-div' : 'server-div') + " flex items-center p-2 pl-0"}>
            <div className="relative w-1 h-8 mr-2 rounded-r-lg server-indicator"></div>
            <div className="flex items-center justify-center w-16 h-16 server-icon">
                {serverIconSrc ? (
                    <Image 
                        src={serverIconSrc} 
                        width={25} 
                        height={25} 
                        alt={serverName} 
                        className=""
                    />
                ) : (
                    <p className="">{serverName[0]}</p>
                )}
            </div>
            <div className="server-nameplate absolute left-24 z-10 bg-white p-2 rounded font-bold shadow-all">
                <p>Test</p>
            </div>
        </div>
    )
}

export default function ServerBar() {
    return (
        <div className="bg-slate-200 shadow-all h-screen overflow-y-scroll">
            <ServerIcon serverName="Test" serverIconSrc="/img/add_server.svg" selected={false} />
            <ServerIcon serverName="Test" serverIconSrc="" selected={false} />
            <ServerIcon serverName="Test" serverIconSrc="" selected={false} />
            <ServerIcon serverName="Test" serverIconSrc="" selected={true} />
            <ServerIcon serverName="Test" serverIconSrc="" selected={false} />
            <ServerIcon serverName="Test" serverIconSrc="" selected={false} />
            <ServerIcon serverName="Test" serverIconSrc="" selected={false} />
            <ServerIcon serverName="Test" serverIconSrc="" selected={false} />
            <ServerIcon serverName="Test" serverIconSrc="" selected={false} />
            <ServerIcon serverName="Test" serverIconSrc="" selected={false} />
        </div>
    )
}