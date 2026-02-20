import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal:      '#144B50',
          tealHov:   '#0f3a3e',
          cream:     '#FFEDE4',
          creamSoft: '#FFF8F4',
          peach:     '#FFB96C',
          coral:     '#FEA691',
          yellow:    '#FFF3CB',
          charcoal:  '#292929',
        },
      },
      fontFamily: {
        sans:  ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
      },
      keyframes: {
        slideUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        dot: {
          '0%, 60%, 100%': { transform: 'translateY(0)' },
          '30%':            { transform: 'translateY(-5px)' },
        },
      },
      animation: {
        slideUp: 'slideUp 0.25s ease-out both',
        fadeIn:  'fadeIn 0.2s ease-out both',
        dot:     'dot 1.4s infinite ease-in-out',
      },
    },
  },
  plugins: [],
};

export default config;
