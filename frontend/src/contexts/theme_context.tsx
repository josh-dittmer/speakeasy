import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';

export type Theme = 'dark' | 'light';

type ThemeContextType = {
    theme: Theme,
    setTheme: Dispatch<SetStateAction<Theme>>
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children, defaultTheme }: { children: ReactNode, defaultTheme: Theme }) {
    const [theme, setTheme] = useState<Theme>(defaultTheme);

    return (
        <ThemeContext.Provider value={{theme: theme, setTheme: setTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}