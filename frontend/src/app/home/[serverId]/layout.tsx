import { useEffect } from 'react';

import ChannelBar from "./components/channel_bar";
import UserBar from "./components/user_bar";

export default function ServerLayout({ children }: Readonly<{ children: React.ReactNode; }>) {    
    return (
        <>
            <div>
                <ChannelBar />
            </div>
            {children}
            <div>
                <UserBar />
            </div>
        </>
    );
  }