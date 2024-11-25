'use client';

import ServerBar from '@/components/server_bar/server_bar';
import { getServerList } from '@/lib/api/requests';
import { ServerArrayT } from 'models';

import './css/layout.css';
import { getServerListQuery } from '@/lib/queries/get_server_list';
import { isMyProfileCompleteQuery } from '@/lib/queries/is_my_profile_complete_query';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SIOProvider } from '@/contexts/sio_context';

export default function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter();
    
    const { data: profileCompleteRes, isSuccess: profileCompleteLoadFinished } = isMyProfileCompleteQuery();

    useEffect(() => {
        if (profileCompleteLoadFinished && !profileCompleteRes?.complete) {
            router.push(`/signup`);
        }
    }, [profileCompleteLoadFinished]);
    
    if (!profileCompleteLoadFinished || !profileCompleteRes.complete) return;

    return (
        <SIOProvider>
            <div className="home-layout">
                <ServerBar />
                {children}
            </div>
        </SIOProvider>
    )
}