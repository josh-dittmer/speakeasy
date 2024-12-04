import { CancelButton, SubmitButton } from '@/components/ui/forms/button/button';
import { NormalForm } from '@/components/ui/forms/form/form';
import ButtonSection from '@/components/ui/forms/section/button_section';
import DescriptionSection from '@/components/ui/forms/section/description_section';
import TitleSection from '@/components/ui/forms/section/title_section';
import Popup from '@/components/ui/popup/popup';
import { leaveServer } from '@/lib/api/requests';
import { getServerListKey } from '@/lib/queries/get_server_list';
import { CLIENT_ID } from '@/lib/util/client_id';
import { useQueryClient } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { ServerT } from 'models';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';

export default function LeaveServer({
    server,
    menuOpen,
    setMenuOpen,
}: {
    server: ServerT;
    menuOpen: boolean;
    setMenuOpen: Dispatch<SetStateAction<boolean>>;
}) {
    const router = useRouter();
    const client = useQueryClient();

    const handleLeaveServer = async () => {
        await leaveServer(server.serverId, {
            clientId: CLIENT_ID,
        });
        client.invalidateQueries({ queryKey: [getServerListKey()] });

        router.push('/home');
    };

    return (
        <Popup open={menuOpen}>
            <NormalForm>
                <TitleSection title={'Leave Server'} icon={LogOut} />
                <DescriptionSection>
                    <span>
                        Are you sure you want to leave{' '}
                        <span className="font-bold">{server.name}</span>?
                    </span>
                </DescriptionSection>
                <ButtonSection>
                    <CancelButton onClick={() => setMenuOpen(false)} />
                    <SubmitButton onClick={handleLeaveServer} enabled={true} text={'Confirm'} />
                </ButtonSection>
            </NormalForm>
        </Popup>
    );
}
