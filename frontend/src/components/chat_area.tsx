'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { ChannelT } from 'models';

function ChatMessage({ author, message, date, profilePicSrc } : { author: string, message: string, date: string, profilePicSrc: string }) {
    return (
        <div className="flex ml-5 mb-5">
            <div className="shrink-0">
                <Image 
                    src={profilePicSrc} 
                    width={50} 
                    height={50} 
                    alt="Profile picture" 
                    className="object-cover rounded-full"
                />
            </div>
            <div className="ml-3">
                <div className="flex items-center">
                    <p className="text-lg text-black">{author}</p>
                    <p className="ml-3 text-xs text-gray-400">{date}</p>
                </div>
                <div className="">
                    <p className="text-md text-gray-600">{message}</p>
                </div>
            </div>
        </div>
    )
}

export default function ChatArea({ channel }: { channel: ChannelT }) {
    useEffect(() => {
        // load messages
    }, []);
    
    return (
        <div className="relative h-screen grow">
            <div className="z-10 absolute h-[48px] w-full bg-white flex items-center p-3 shadow-b">
                <p className="mr-2 text-gray-500 text-xl font-bold">T</p>
                <p className="text-lg text-gray-600">{channel.name}</p>
            </div>
            <div className="absolute bottom-[70px] h-full overflow-y-scroll w-auto">
                <div className="">
                    <div className="h-[118px] mt-3"></div>
                    <ChatMessage author="Test" message="Test message" date="10/15/24 9:34 PM" profilePicSrc="/img/profile_pic.jpg" />
                    <ChatMessage author="Test" message="Test message 2" date="10/15/24 9:34 PM" profilePicSrc="/img/profile_pic.jpg" />
                    <ChatMessage author="Test" message="Test message 3" date="10/15/24 9:34 PM" profilePicSrc="/img/profile_pic.jpg" />
                    <ChatMessage author="Test" message="Test message" date="10/15/24 9:34 PM" profilePicSrc="/img/profile_pic.jpg" />
                    <ChatMessage author="Test" message="Test message 2" date="10/15/24 9:34 PM" profilePicSrc="/img/profile_pic.jpg" />
                    <ChatMessage author="Test" message="Test message 3" date="10/15/24 9:34 PM" profilePicSrc="/img/profile_pic.jpg" />
                    <ChatMessage author="Test" message="Test message" date="10/15/24 9:34 PM" profilePicSrc="/img/profile_pic.jpg" />
                    <ChatMessage author="Test" message="Test message 2" date="10/15/24 9:34 PM" profilePicSrc="/img/profile_pic.jpg" />
                    <ChatMessage author="Test" message="Test message 3" date="10/15/24 9:34 PM" profilePicSrc="/img/profile_pic.jpg" />
                    <ChatMessage author="Test" message="Test message" date="10/15/24 9:34 PM" profilePicSrc="/img/profile_pic.jpg" />
                    <ChatMessage author="Test" message="Test message 2" date="10/15/24 9:34 PM" profilePicSrc="/img/profile_pic.jpg" />
                    <ChatMessage author="Test" message="Test message 3" date="10/15/24 9:34 PM" profilePicSrc="/img/profile_pic.jpg" />
                    <ChatMessage author="Test" message="Test message" date="10/15/24 9:34 PM" profilePicSrc="/img/profile_pic.jpg" />
                    <ChatMessage author="Test" message="Test message 2" date="10/15/24 9:34 PM" profilePicSrc="/img/profile_pic.jpg" />
                    <ChatMessage author="Test" message="Test message 3" date="10/15/24 9:34 PM" profilePicSrc="/img/profile_pic.jpg" />
                    <ChatMessage author="Test" message="Test message" date="10/15/24 9:34 PM" profilePicSrc="/img/profile_pic.jpg" />
                    <ChatMessage author="Test" message="Test message 2" date="10/15/24 9:34 PM" profilePicSrc="/img/profile_pic.jpg" />
                    <ChatMessage author="Test" message="Test message 3" date="10/15/24 9:34 PM" profilePicSrc="/img/profile_pic.jpg" />
                    <ChatMessage author="Test" message="Test message" date="10/15/24 9:34 PM" profilePicSrc="/img/profile_pic.jpg" />
                    <ChatMessage author="Test" message="Test message 2" date="10/15/24 9:34 PM" profilePicSrc="/img/profile_pic.jpg" />
                    <ChatMessage author="Test" message="Test message 3" date="10/15/24 9:34 PM" profilePicSrc="/img/profile_pic.jpg" />
                    <ChatMessage author="Test" message="Here is a much longer message. I am typing lots of random bullshit in order to make the text wrap so I can see how it looks. Long message very extremely long many several words and make it very extremely long message very long message extra long very long." date="10/15/24 9:34 PM" profilePicSrc="/img/profile_pic.jpg" />
                    <ChatMessage author="Test" message="Here is a much longer message. I am typing lots of random bullshit in order to make the text wrap so I can see how it looks. Long message very extremely long many several words and make it very extremely long message very long message extra long very long." date="10/15/24 9:34 PM" profilePicSrc="/img/profile_pic.jpg" />
                    <ChatMessage author="Test" message="Here is a much longer message. I am typing lots of random bullshit in order to make the text wrap so I can see how it looks. Long message very extremely long many several words and make it very extremely long message very long message extra long very long." date="10/15/24 9:34 PM" profilePicSrc="/img/profile_pic.jpg" />
                    <ChatMessage author="Test" message="Here is a much longer message. I am typing lots of random bullshit in order to make the text wrap so I can see how it looks. Long message very extremely long many several words and make it very extremely long message very long message extra long very long." date="10/15/24 9:34 PM" profilePicSrc="/img/profile_pic.jpg" />
                    <ChatMessage author="Test" message="Here is a much longer message. I am typing lots of random bullshit in order to make the text wrap so I can see how it looks. Long message very extremely long many several words and make it very extremely long message very long message extra long very long." date="10/15/24 9:34 PM" profilePicSrc="/img/profile_pic.jpg" />
                </div>
            </div>
            <div className="flex justify-center items-center absolute bottom-0 h-[70px] w-full p-3">
                <input 
                    type="text" 
                    placeholder={`Send a message to ${channel.name}...`} 
                    className="w-full bg-slate-100 p-3 rounded focus:outline-none"    
                />
            </div>
        </div>
    )
}