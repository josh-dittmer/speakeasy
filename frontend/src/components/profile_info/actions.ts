'use server';

import { Tags } from "@/lib/api/requests";
import { revalidateTag } from "next/cache";

export async function invalidateServerData(serverId: string) {
    revalidateTag(serverId);
}

export async function invalidateUser() {
    revalidateTag(Tags.myself);
}