import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light Editorial Luxe Palette
        white: '#ffffff',
        snow: '#fafaf9',
        cream: '#f5f2ed',
        linen: '#ebe7e0',
        sand: '#d4d0c8',

        ink: '#1a1a1a',
        charcoal: '#2d2d2d',
        graphite: '#4a4a4a',
        stone: '#6b6b6b',
        muted: '#9a9a9a',

        amber: '#b8860b',
        gold: '#996515',
        honey: '#daa520',

        sage: '#5a7c5a',
        emerald: '#3d6b4f',

        rose: '#b35959',
        coral: '#c76a5e',

        sky: '#5a7c99',
        azure: '#4a6d8a',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'Menlo', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1' }],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 2px 8px rgba(0, 0, 0, 0.1), 0 8px 24px rgba(0, 0, 0, 0.06)',
        'column': '0 0 0 1px rgba(0, 0, 0, 0.05), 0 4px 16px rgba(0, 0, 0, 0.06)',
        'elevated': '0 4px 12px rgba(0, 0, 0, 0.1), 0 12px 32px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
