'use client';

import { createLoginUrl } from '@/lib/auth/auth';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { getClientId } from '../actions';

export default function LoginPage() {
    const searchParams = useSearchParams();

    const clearSession = searchParams.get('clear_session');
    const shouldClearSession = clearSession === '1';

    useEffect(() => {
        const loginRedirect = async () => {
            const loginUrl = await createLoginUrl(await getClientId(), shouldClearSession);
            window.location.href = loginUrl;
        };

        loginRedirect();
    }, [shouldClearSession]);

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center">
            <Image
                src={'/img/image_loading.gif'}
                width={64}
                height={64}
                //sizes="100vw"
                //className="w-16 h-16"
                alt="Loading"
            />
            <p className="text-fg-dark">Redirecting to login...</p>
        </div>
    );
}
