'use client';

import { createLoginUrl } from '@/lib/auth/auth';
import Image from 'next/image';
import { getClientId } from '../actions';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
    const searchParams = useSearchParams();

    const clearSession = searchParams.get('clear_session');
    const shouldClearSession = clearSession === '1';

    const loginRedirect = async () => {
        const loginUrl = await createLoginUrl(await getClientId(), shouldClearSession);
        window.location.href = loginUrl;
    };

    useEffect(() => {
        loginRedirect();
    }, []);
    
    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center">
            <Image
                src={'/img/image_loading.gif'}
                width={0}
                height={0}
                sizes="100vw"
                className="w-16 h-16"
                alt="Loading"
            />
            <p className="text-fg-dark">Redirecting to login...</p>
        </div>
    )
}