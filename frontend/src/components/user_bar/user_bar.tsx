import { UserArrayT, UserT } from 'models';
import Image from 'next/image';

import './user_bar.css'

function UserCard({ user } : { user: UserT }) {
    const status: string = 'offline';
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
        <div className="hover:bg-gray-200 p-0.5 m-1.5 rounded">
            <div className="flex items-center pl-3 mb-1 mt-1">
                <div className="relative">
                    <Image 
                        src={'/img/profile_pic.jpg'}
                        width={35}
                        height={35}
                        alt="Profile picture"
                        className="rounded-full"
                    />
                    <span className={"absolute bottom-0 right-0 w-3 h-3 rounded-full " + statusColor}></span>
                </div>
                <div className="ml-2">
                    <p className="text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.bio}</p>
                </div>
            </div>
        </div>
    )
}

export default function UserBar({ users }: { users: UserArrayT }) {
    return (
        <div className="hidden md:block relative bg-slate-100 h-screen w-[208px]">
            <div className="absolute h-[48px] w-52 shadow-b p-3 bg-white"></div>
            <div className="user-bar absolute top-[48px] overflow-y-scroll w-full h-full">
                <div className="p-3">
                    <p className="text-xs font-bold text-gray-500">ONLINE USERS</p>
                </div>
                <div className="">
                    {users.map((user, index) => {
                        return <UserCard key={index} user={user} />
                    })}
                </div>
                <div className="p-3">
                    <p className="text-xs font-bold text-gray-500">OFFLINE USERS</p>
                </div>
                <div className="">
                </div>
            </div>
        </div>
    )
}