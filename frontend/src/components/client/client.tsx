'use client';

import { WSProvider } from "@/contexts/ws_content";

export default function Client({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <WSProvider url={''}>
                {children}
            </WSProvider>
        </>
    )
}