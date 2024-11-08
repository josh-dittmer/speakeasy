'use server';

import { Tags } from "@/lib/api/requests";
import { revalidateTag } from "next/cache";

export async function invalidateServers() {
    revalidateTag(Tags.servers);
}

export async function invalidateUser() {
    revalidateTag(Tags.myself);
}