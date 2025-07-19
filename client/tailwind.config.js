/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#7be3c4',
          DEFAULT: '#3ca381',
          dark: '#217a5b',
        },
        dark: '#111111',
        gray: {
          light: '#e6e6e6',
        },
      },
    },
  },
  plugins: [],
};
