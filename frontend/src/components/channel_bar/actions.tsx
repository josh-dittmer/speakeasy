'use server';

import { Tags } from '@/lib/api/requests';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function invalidateServerData(serverId: string) {
    revalidateTag(serverId);
}

export async function invalidateServers() {
    revalidateTag(Tags.servers);
}