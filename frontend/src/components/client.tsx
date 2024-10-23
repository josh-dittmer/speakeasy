'use client';

import { WSProvider } from "@/context/wsContext";

export default function Client({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <WSProvider url={''}>
                {children}
            </WSProvider>
        </>
    )
}