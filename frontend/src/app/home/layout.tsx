'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'

import ServerBar from './components/server_bar';
import { WSProvider } from '../context/wsContext';
import { endpoints } from '../endpoints/endpoints'

export default function HomeLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    const router = useRouter();
    
    useEffect(() => {
        // check if refresh token is expired
    }, [router])
    
    return (
        <div className="flex">
            <WSProvider url={endpoints.WS_API}>
                <div>
                    <ServerBar />
                </div>
                {children}
            </WSProvider>
        </div>
    );
  }