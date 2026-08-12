import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: '1rem',
                md: '1.5rem',
            },
        },
        extend: {
            colors: {
                black: "#000000",
                primary: {
                    DEFAULT: "var(--color-primary)",
                    foreground: "var(--color-primary-foreground)",
                },
                secondary: {
                    DEFAULT: "var(--color-secondary)",
                    foreground: "var(--color-secondary-foreground)",
                },
                accent: {
                    DEFAULT: "var(--color-accent)",
                    foreground: "var(--color-accent-foreground)",
                },
                muted: {
                    DEFAULT: "var(--color-muted)",
                    foreground: "var(--color-muted-foreground)",
                },
                card: {
                    DEFAULT: "var(--color-card)",
                    foreground: "var(--color-card-foreground)",
                },
                border: "var(--color-border)",
                input: "var(--color-input)",
                background: "var(--color-background)",
                foreground: "var(--color-foreground)",
            },
            fontFamily: {
                sans: ["var(--font-sans)"],
                serif: ["var(--font-serif)"],
                "open-sans": ["var(--font-open-sans)", "sans-serif"],
                mono: ["var(--font-open-sans)", "sans-serif"],
            },
            borderRadius: {
                lg: "var(--radius-lg)",
                md: "var(--radius-md)",
                sm: "var(--radius-sm)",
            },
            fontSize: {
                'aalto-1': '0.875rem',
                'aalto-2': '1rem',
                'aalto-3': '1.125rem',
                'aalto-4': '1.25rem',
                'aalto-5': '1.5rem',
                'aalto-6': '2rem',
                'aalto-7': '4rem',
            },
            lineHeight: {
                'aalto-1': '1rem',
                'aalto-2': '1.5rem',
                'aalto-3': '1.75rem',
                'aalto-4': '2rem',
                'aalto-5': '2.5rem',
                'aalto-6': '3rem',
                'aalto-7': '4.5rem',
            },
            letterSpacing: {
                'aalto-1': '0rem',
                'aalto-2': '-0.0625rem',
                'aalto-3': '-0.125rem',
            },
            spacing: {
                'aalto-p1': '0rem',
                'aalto-p2': '0.875rem',
                'aalto-p3': '1rem',
                'aalto-p4': '1.125rem',
                'aalto-p5': '1.25rem',
                'aalto-p6': '1.5rem',
            },
            transitionTimingFunction: {
                'aalto-in': 'cubic-bezier(0.3, 0, 0.65, 0)',
                'aalto-out': 'cubic-bezier(0.3, 1, 0.65, 1)',
                'aalto-in-out': 'cubic-bezier(0.65, 0, 0.3, 0)',
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],
};
export default config;
