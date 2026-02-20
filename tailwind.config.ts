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
          teal:     '#144b50',
          tealHov:  '#3d3d3d',   // Personage exact button hover
          cream:    '#ffede4',   // Personage secondary bg
          peach:    '#ffbb99',   // Personage exact accent
          charcoal: '#292929',   // Personage exact text
        },
      },
      fontFamily: {
        sans:  ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
      },
      keyframes: {
        slideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        dot: {
          '0%, 60%, 100%': { transform: 'translateY(0)' },
          '30%':            { transform: 'translateY(-4px)' },
        },
      },
      animation: {
        slideUp: 'slideUp 0.22s ease-out both',
        fadeIn:  'fadeIn 0.3s ease-out both',
        dot:     'dot 1.4s infinite ease-in-out',
      },
    },
  },
  plugins: [],
};

export default config;
