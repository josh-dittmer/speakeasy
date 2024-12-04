import { useGetMyUserDataQuery } from '@/lib/queries/get_my_user_data';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import ProfileImage from '../profile_image/profile_image';
import ProfileMenu from './forms/profile_menu';

export default function ProfileInfo() {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const { data, isLoading } = useGetMyUserDataQuery();

    if (isLoading) {
        return (
            <div className="h-16 flex justify-center items-center">
                <Image
                    src={'/img/image_loading.gif'}
                    width={64}
                    height={64}
                    //sizes="100vw"
                    //className="w-16 h-16"
                    alt="Profile info loading"
                />
            </div>
        );
    }

    if (!data) return;

    return (
        <>
            <ProfileMenu user={data} open={menuOpen} setOpen={setMenuOpen} />
            <div
                onClick={() => setMenuOpen(old => !old)}
                className="flex items-center h-16 bg-bg-medium-dark hover:bg-bg-dark"
            >
                <div className="p-2">
                    <ProfileImage name={data.name} imageId={data.imageId} className="bg-bg-light" />
                </div>
                <div className="">
                    <p className="text-sm text-fg-dark max-w-24 truncate">{data.name}</p>
                    <p className="text-sm text-fg-medium max-w-24 truncate">{data.bio}</p>
                </div>
                <div className="flex justify-end grow p-4">
                    {menuOpen ? (
                        <ChevronDown width={15} height={15} className="text-fg-medium" />
                    ) : (
                        <ChevronUp width={15} height={15} className="text-fg-medium" />
                    )}
                </div>
            </div>
        </>
    );
}
