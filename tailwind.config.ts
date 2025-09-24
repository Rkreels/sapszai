
import type { Config } from "tailwindcss";

import tailwindcssAnimate from "tailwindcss-animate";

export default {
        darkMode: ["class"],
        content: [
                "./pages/**/*.{ts,tsx}",
                "./components/**/*.{ts,tsx}",
                "./app/**/*.{ts,tsx}",
                "./src/**/*.{ts,tsx}",
        ],
        prefix: "",
        theme: {
                container: {
                        center: true,
                        padding: '2rem',
                        screens: {
                                '2xl': '1400px'
                        }
                },
                extend: {
                        colors: {
                                border: 'hsl(var(--border))',
                                input: 'hsl(var(--input))',
                                ring: 'hsl(var(--ring))',
                                background: 'hsl(var(--background))',
                                foreground: 'hsl(var(--foreground))',
                                primary: {
                                        DEFAULT: 'hsl(var(--primary))',
                                        foreground: 'hsl(var(--primary-foreground))'
                                },
                                secondary: {
                                        DEFAULT: 'hsl(var(--secondary))',
                                        foreground: 'hsl(var(--secondary-foreground))'
                                },
                                destructive: {
                                        DEFAULT: 'hsl(var(--destructive))',
                                        foreground: 'hsl(var(--destructive-foreground))'
                                },
                                muted: {
                                        DEFAULT: 'hsl(var(--muted))',
                                        foreground: 'hsl(var(--muted-foreground))'
                                },
                                accent: {
                                        DEFAULT: 'hsl(var(--accent))',
                                        foreground: 'hsl(var(--accent-foreground))'
                                },
                                popover: {
                                        DEFAULT: 'hsl(var(--popover))',
                                        foreground: 'hsl(var(--popover-foreground))'
                                },
                                card: {
                                        DEFAULT: 'hsl(var(--card))',
                                        foreground: 'hsl(var(--card-foreground))'
                                },
                                // SAP specific colors
                                'sap-blue': '#006CE5',
                                'sap-light-blue': '#0a6ed1',
                                'sap-bg': '#f5f5f5',
                                'sap-text': '#32363a',
                                'sap-tile-border': '#e5e5e5',
                                // Module specific colors
                                'finance': '#FF005A',
                                'manufacturing': '#E76500',
                                'procurement': '#7800C7',
                                'sales': '#0070F2',
                                'project': '#E03800',
                                'overview': '#0050D4',
                                'other': '#9C52FF',
                        },
                        borderRadius: {
                                lg: 'var(--radius)',
                                md: 'calc(var(--radius) - 2px)',
                                sm: 'calc(var(--radius) - 4px)'
                        },
                        keyframes: {
                                'accordion-down': {
                                        from: { height: '0' },
                                        to: { height: 'var(--radix-accordion-content-height)' }
                                },
                                'accordion-up': {
                                        from: { height: 'var(--radix-accordion-content-height)' },
                                        to: { height: '0' }
                                },
                                'fade-in': {
                                        '0%': { opacity: '0' },
                                        '100%': { opacity: '1' }
                                }
                        },
                        animation: {
                                'accordion-down': 'accordion-down 0.2s ease-out',
                                'accordion-up': 'accordion-up 0.2s ease-out',
                                'fade-in': 'fade-in 0.3s ease-out'
                        }
                }
        },
        plugins: [tailwindcssAnimate],
} satisfies Config;
