'use client';

import { UserArrayT, UserT } from 'models';
import Image from 'next/image';
import ThemeToggle from '@/components/theme_toggle/theme_toggle';


import './user_bar.css'
import ProfileImage from '../profile_image/profile_image';

function UserCard({ user } : { user: UserT }) {
    const status: string = 'online';
    let statusColor;

    switch(status) {
        case 'online':
            statusColor = 'bg-green-500';
            break;
        case 'away':
            statusColor = 'bg-yellow-500';
            break;
        case 'dnd':
            statusColor = 'bg-red-500';
            break;
        case 'offline':
        default:
            statusColor = 'bg-gray-400';
            break;
    }
    
    return (
        <div className="hover:bg-bg-dark p-0.5">
            <div className="flex items-center pl-3 mb-1 mt-1">
                <div className="relative">
                    <ProfileImage name={user.name} imageId={user.imageId} className="bg-bg-light" />
                    <span className={"absolute bottom-0 right-0 w-3 h-3 rounded-full " + statusColor}></span>
                </div>
                <div className="ml-2">
                    <p className="text-sm text-fg-dark max-w-28 truncate">{user.name}</p>
                    <p className="text-xs text-fg-light max-w-28 truncate">{user.bio}</p>
                </div>
            </div>
        </div>
    )
}

export default function UserBar({ users }: { users: UserArrayT }) {
    return (
        <div className="text-nowrap relative bg-bg-medium h-screen">
            <div className="flex justify-end h-header shadow-b p-3 bg-bg-light">
                <ThemeToggle />
            </div>
            <div className="overflow-y-scroll">
                <div className="p-3">
                    <p className="text-xs font-bold text-fg-medium">ONLINE USERS</p>
                </div>
                <div className="">
                    {users.map((user) => {
                        return <UserCard key={user.userId} user={user} />
                    })}
                </div>
                <div className="p-3">
                    <p className="text-xs font-bold text-fg-medium">OFFLINE USERS</p>
                </div>
            </div>
        </div>
    )
}