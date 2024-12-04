'use client';

import ServerBar from '@/components/server_bar/server_bar';

import SIOClient from '@/components/sio_client/sio_client';
import { useIsMyProfileCompleteQuery } from '@/lib/queries/is_my_profile_complete_query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import './css/layout.css';

export default function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter();

    const { data: profileCompleteRes, isSuccess: profileCompleteLoadFinished } =
        useIsMyProfileCompleteQuery();

    useEffect(() => {
        if (profileCompleteLoadFinished && !profileCompleteRes?.complete) {
            router.push(`/signup`);
        }
    }, [profileCompleteLoadFinished, profileCompleteRes?.complete, router]);

    if (!profileCompleteLoadFinished || !profileCompleteRes.complete) return;

    return (
        <SIOClient>
            <div className="home-layout">
                <ServerBar />
                {children}
            </div>
        </SIOClient>
    );
}
