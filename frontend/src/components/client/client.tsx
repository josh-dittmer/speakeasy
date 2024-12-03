'use client';

import { ThemeContext, ThemeProvider } from "@/contexts/theme_context";
import { useContext, useState } from "react";

import '@/app/globals.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { endpoints } from "@/lib/api/endpoints";

function ApplyTheme({ children }: Readonly<{ children: React.ReactNode }>) {
    const theme = useContext(ThemeContext);

    return (
        <div className={theme?.theme}>
            {children}
        </div>
    )
}

export default function Client({ children }: Readonly<{ children: React.ReactNode }>) {
    const [queryClient] = useState(new QueryClient());

    return (
        <>
            <ThemeProvider defaultTheme={'dark'}>
            <QueryClientProvider client={queryClient}>
                <ApplyTheme>
                    {children}
                </ApplyTheme>
            </QueryClientProvider>
            </ThemeProvider>
        </>
    )
}