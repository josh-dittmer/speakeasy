import Image from 'next/image';

function UserCard({ username, profilePicSrc, bio, status} : { username: string, profilePicSrc: string, bio: string, status: string }) {
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
        <div className="flex items-center pl-3 mb-3">
            <div className="relative">
                <Image 
                    src={profilePicSrc}
                    width={35}
                    height={35}
                    alt="Profile picture"
                    className="rounded-full"
                />
                <span className={"absolute bottom-0 right-0 w-3 h-3 rounded-full " + statusColor}></span>
            </div>
            <div className="ml-2">
                <p className="text-sm">{username}</p>
                <p className="text-xs text-gray-500">{bio}</p>
            </div>
        </div>
    )
}

export default function UserBar() {
    return (
        <div className="hidden md:block relative bg-slate-100 h-screen w-52">
            <div className="absolute h-[48px] w-52 shadow-b p-3 bg-white"></div>
            <div className="absolute top-[48px] overflow-y-scroll w-full h-full">
                <div className="p-3">
                    <p className="text-xs font-bold text-gray-500">ONLINE USERS</p>
                </div>
                <div className="">
                    <UserCard username="Test User" profilePicSrc="/img/profile_pic.jpg" bio="Hello, world!" status="online" />
                    <UserCard username="Test User" profilePicSrc="/img/profile_pic.jpg" bio="" status="away" />
                    <UserCard username="Test User" profilePicSrc="/img/profile_pic.jpg" bio="Hello, world!" status="dnd" />
                </div>
                <div className="p-3">
                    <p className="text-xs font-bold text-gray-500">OFFLINE USERS</p>
                </div>
                <div className="">
                    <UserCard username="Test User" profilePicSrc="/img/profile_pic.jpg" bio="" status="offline" />
                    <UserCard username="Test User" profilePicSrc="/img/profile_pic.jpg" bio="Hello, world!" status="offline" />
                    <UserCard username="Test User" profilePicSrc="/img/profile_pic.jpg" bio="" status="offline" />
                    <UserCard username="Test User" profilePicSrc="/img/profile_pic.jpg" bio="" status="offline" />
                    <UserCard username="Test User" profilePicSrc="/img/profile_pic.jpg" bio="Hello, world!" status="offline" />
                    <UserCard username="Test User" profilePicSrc="/img/profile_pic.jpg" bio="" status="offline" />
                    <UserCard username="Test User" profilePicSrc="/img/profile_pic.jpg" bio="" status="offline" />
                    <UserCard username="Test User" profilePicSrc="/img/profile_pic.jpg" bio="Hello, world!" status="offline" />
                    <UserCard username="Test User" profilePicSrc="/img/profile_pic.jpg" bio="" status="offline" />
                    <UserCard username="Test User" profilePicSrc="/img/profile_pic.jpg" bio="" status="offline" />
                    <UserCard username="Test User" profilePicSrc="/img/profile_pic.jpg" bio="Hello, world!" status="offline" />
                    <UserCard username="Test User" profilePicSrc="/img/profile_pic.jpg" bio="" status="offline" />
                    <UserCard username="Test User" profilePicSrc="/img/profile_pic.jpg" bio="" status="offline" />
                    <UserCard username="Test User" profilePicSrc="/img/profile_pic.jpg" bio="Hello, world!" status="offline" />
                    <UserCard username="Test User" profilePicSrc="/img/profile_pic.jpg" bio="" status="offline" />
                    <UserCard username="Test User" profilePicSrc="/img/profile_pic.jpg" bio="" status="offline" />
                    <UserCard username="Test User" profilePicSrc="/img/profile_pic.jpg" bio="Hello, world!" status="offline" />
                    <UserCard username="Test User" profilePicSrc="/img/profile_pic.jpg" bio="" status="offline" />
                    <UserCard username="Test User" profilePicSrc="/img/profile_pic.jpg" bio="" status="offline" />
                    <UserCard username="Test User" profilePicSrc="/img/profile_pic.jpg" bio="Hello, world!" status="offline" />
                    <UserCard username="Test User" profilePicSrc="/img/profile_pic.jpg" bio="" status="offline" />
                </div>
            </div>
        </div>
    )
}