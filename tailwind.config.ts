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
        // Dark Editorial Luxe Palette
        void: '#0a0a0a',
        charcoal: '#121212',
        graphite: '#1a1a1a',
        slate: '#252525',
        ash: '#333333',

        cream: '#f5f0e8',
        parchment: '#e8e0d4',
        stone: '#9a9590',
        muted: '#6b6560',

        amber: '#d4a574',
        gold: '#c49a6c',
        honey: '#e8c49a',

        sage: '#7d9a7d',
        emerald: '#4a7c59',

        rose: '#c47d7d',
        coral: '#d4847a',

        sky: '#7d9aad',
        azure: '#5a7c99',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'Menlo', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1' }],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(212, 165, 116, 0.15)',
        'glow-lg': '0 0 40px rgba(212, 165, 116, 0.2)',
        'inner-glow': 'inset 0 0 20px rgba(212, 165, 116, 0.05)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.5)',
        'elevated': '0 12px 40px rgba(0, 0, 0, 0.6)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-editorial': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(212, 165, 116, 0.1), transparent)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'shimmer': 'shimmer 2s infinite',
        'subtle-pulse': 'subtlePulse 2s ease-in-out infinite',
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
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        subtlePulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      transitionTimingFunction: {
        'editorial': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
};
export default config;
