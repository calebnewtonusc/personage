import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f0f7f1',
          100: '#d8edd9',
          200: '#b3d9b5',
          300: '#80bc84',
          400: '#53a259',
          500: '#3a8a40',
          600: '#2d7033',
          700: '#245828',
          800: '#1e4622',
          900: '#193a1c',
        },
      },
    },
  },
  plugins: [],
};

export default config;
