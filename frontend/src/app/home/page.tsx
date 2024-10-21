import { endpoints } from '@/lib/endpoints';
import { LastVisitedServer, LastVisitedServerT } from 'models';
import { isLeft } from 'fp-ts/Either'
import { redirect } from 'next/navigation';
import { getLastVisitedServer } from '@/lib/requests';

export default async function HomePage() {
    const lastVisitedServer: LastVisitedServerT = await getLastVisitedServer();
    redirect(`/home/${lastVisitedServer.serverId}`);
}