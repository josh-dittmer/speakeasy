'use client';

import { handleCallback, createLoginUrl } from '@/lib/auth/auth';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getClientId } from '../actions';
import { useQuery } from '@tanstack/react-query';

export default function CallbackPage() {
    const searchParams = useSearchParams();

    const code = searchParams.get('code');
    const state = searchParams.get('state');

    const router = useRouter();

    const finishLogin = async () => {
        if (!code || !state) {
            throw new Error('missing required params');
        }

        const clientId = await getClientId();
        await handleCallback(clientId, code, state);

        return true;
    };

    const { data, isError, isSuccess } = useQuery({
        queryKey: ['finishLogin'],
        queryFn: finishLogin,
        staleTime: Infinity,
        retry: false
    });

    useEffect(() => {
        if (isSuccess) {
            router.push('/home');
            //console.log('yay');
        }
    }, [data]);


    if (isError) {
        return (
            <div className="w-screen h-screen flex flex-col justify-center items-center">
                <p className="text-fg-dark">Something went wrong!</p>
                <Link className="text-fg-dark underline" href="/login">Try Again</Link>
            </div>
        )
    }

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
            <p className="text-fg-dark">Login complete!</p>
        </div>
    )
}