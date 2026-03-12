/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: 'rgb(var(--color-background) / <alpha-value>)',
                surface: 'rgb(var(--color-surface) / <alpha-value>)',
                primary: 'rgb(var(--color-primary) / <alpha-value>)',
                primaryHover: 'rgb(var(--color-primaryHover) / <alpha-value>)',
                secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
                textDark: 'rgb(var(--color-textDark) / <alpha-value>)',
                textLight: 'rgb(var(--color-textLight) / <alpha-value>)',
                success: 'rgb(var(--color-success) / <alpha-value>)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            boxShadow: {
                'soft': '0 10px 40px -10px rgba(27, 37, 90, 0.08)',
                'card': '0 4px 20px -5px rgba(27, 37, 90, 0.05)',
                'neon-orange': '0 0 15px rgba(255, 122, 26, 0.4)',
                'neon-blue': '0 0 15px rgba(27, 37, 90, 0.3)',
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
                '4xl': '2rem',
            }
        },
    },
    plugins: [],
}
