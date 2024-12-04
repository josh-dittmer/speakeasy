'use client';

import { ThemeContext } from '@/contexts/theme_context';
import { useContext } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
    const theme = useContext(ThemeContext);

    const switchTheme = () => {
        theme?.setTheme(theme.theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <button className="bg-bg-medium hover:bg-bg-dark p-1 rounded" onClick={switchTheme}>
            {theme?.theme === 'light' ? (
                <Moon width={15} height={15} className="text-fg-light"></Moon>
            ) : (
                <Sun width={15} height={15} className="text-fg-light"></Sun>
            )}
        </button>
    );
}
