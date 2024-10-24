'use client';

import { WSProvider } from "@/contexts/ws_context";
import { ThemeContext, ThemeProvider } from "@/contexts/theme_context";
import { useContext } from "react";

import '@/app/globals.css';

function ApplyTheme({ children }: Readonly<{ children: React.ReactNode }>) {
    const theme = useContext(ThemeContext);

    return (
        <div className={theme?.theme}>
            {children}
        </div>
    )
}

export default function Client({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <ThemeProvider defaultTheme={'dark'}>
            <WSProvider url={''}>
                <ApplyTheme>
                    {children}
                </ApplyTheme>
            </WSProvider>
            </ThemeProvider>
        </>
    )
}