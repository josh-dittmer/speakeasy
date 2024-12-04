import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: ['class'],
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'bg-dark': 'var(--bg-dark)',
                'bg-medium-dark': 'var(--bg-medium-dark)',
                'bg-medium': 'var(--bg-medium)',
                'bg-light': 'var(--bg-light)',
                'bg-accent': 'var(--bg-accent)',
                'bg-accent-dark': 'var(--bg-accent-dark)',
                'fg-dark': 'var(--fg-dark)',
                'fg-medium': 'var(--fg-medium)',
                'fg-light': 'var(--fg-light)',
                'fg-accent': 'var(--fg-accent)',
            },
            height: {
                header: 'var(--header-height)',
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
};
export default config;
