'use server';

import { redirect } from 'next/navigation';

export async function getClientId() {
    return process.env.CLIENT_ID!;
}

export async function navigate(location: string) {
    redirect(location);
}
