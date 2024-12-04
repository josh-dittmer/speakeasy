import { CancelButton, SubmitButton } from '@/components/ui/forms/button/button';
import CopyableText from '@/components/ui/forms/copyable_text/copyable_text';
import Dropdown, { Option } from '@/components/ui/forms/dropdown/dropdown';
import { NormalForm } from '@/components/ui/forms/form/form';
import ButtonSection from '@/components/ui/forms/section/button_section';
import TitleSection from '@/components/ui/forms/section/title_section';
import Popup from '@/components/ui/popup/popup';
import { useCreateInviteMutation } from '@/lib/mutations/create_invite';
import { Plus } from 'lucide-react';
import { ServerT } from 'models';
import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';

export default function CreateInvite({
    server,
    menuOpen,
    setMenuOpen,
}: {
    server: ServerT;
    menuOpen: boolean;
    setMenuOpen: Dispatch<SetStateAction<boolean>>;
}) {
    const [timeOption, setTimeOption] = useState<string>('1');
    const [timeOptionValid, setTimeOptionValid] = useState<boolean>();

    const [submitted, setSubmitted] = useState<boolean>();

    const valid = timeOptionValid;

    const allowedTimeOptions: Option[] = [
        { value: '1', title: '5 minutes' },
        { value: '2', title: '1 hour' },
        { value: '3', title: '8 hours' },
        { value: '4', title: '1 day' },
        { value: '5', title: '30 days' },
        { value: '6', title: 'Forever' },
    ];

    const times = new Map([
        ['1', 300000],
        ['2', 3600000],
        ['3', 28800000],
        ['4', 86400000],
        ['5', 2592000000],
        ['6', null],
    ]);

    const { mutate, isPending } = useCreateInviteMutation(server.serverId);

    const [inviteId, setInviteId] = useState<string>();

    const handleCreateInvite = async () => {
        mutate({
            validFor: times.get(timeOption) || null,
            callbackFn: (inviteId: string) => {
                setInviteId(inviteId);
            }
        });

        setSubmitted(true);
    };

    const handleReset = () => {
        setMenuOpen(false);
        setInviteId('');
        setSubmitted(false);
        setTimeOption('1');
    }

    return (
        <Popup open={menuOpen}>
            <NormalForm width={'25rem'} >
                {isPending && (
                    <>
                        <TitleSection title={'Create Invite'} icon={Plus} />
                        <div className="flex justify-center items-center p-5">
                            <Image
                                src={'/img/image_loading.gif'}
                                width={64}
                                height={64}
                                //sizes="100vw"
                                //className="w-16 h-16"
                                alt="Profile info loading"
                            />
                        </div>
                    </>
                )}
                {!isPending && !submitted && (
                    <>
                        <TitleSection title={'Create Invite'} icon={Plus} />
                        <Dropdown
                            options={allowedTimeOptions}
                            selectedOption={timeOption}
                            setSelectedOption={setTimeOption}
                            title={'Time until expiration'}
                            submitted={submitted}
                            setValid={setTimeOptionValid}
                        />
                        <ButtonSection>
                            <CancelButton onClick={() => setMenuOpen(false)} />
                            <SubmitButton onClick={handleCreateInvite} enabled={valid} text={'Create'} />
                        </ButtonSection>
                    </>
                )}
                {!isPending && submitted && inviteId && (
                    <>
                        <TitleSection title={'Create Invite'} icon={Plus} />
                        <CopyableText title={'Invite Link'} text={`${process.env.NEXT_PUBLIC_SELF_URL}/join/${inviteId}`} />
                        <ButtonSection>
                            {[<SubmitButton key={'piss'} onClick={handleReset} enabled={true} text={'Close'} />]}
                        </ButtonSection>
                    </>
                )}
            </NormalForm>
        </Popup>
    );
}
