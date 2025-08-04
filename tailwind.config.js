/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'brand-brown': {
          50: '#faf8f5',
          100: '#f4f0e8',
          200: '#e8dcc8',
          300: '#d9c4a0',
          400: '#c8a876',
          500: '#b8935a',
          600: '#a17c4e',
          700: '#876543',
          800: '#6f533a',
          900: '#5a4530',
        },
        'brand-beige': {
          50: '#fefcf9',
          100: '#fdf8f0',
          200: '#faf0de',
          300: '#f5e4c8',
          400: '#eed5ab',
          500: '#e5c288',
          600: '#d9ab6a',
          700: '#c8924d',
          800: '#a67640',
          900: '#856137',
        },
      },
    },
  },
  plugins: [],
} 