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
        // Enhanced gray-based palette with better contrast and richness
        'brand-gray': {
          50: '#f8f9fa',   // Crisp white background
          100: '#e9ecef',  // Very light gray with more presence
          200: '#dee2e6',  // Light border gray
          300: '#ced4da',  // Medium light gray
          400: '#adb5bd',  // Balanced medium gray
          500: '#6c757d',  // Strong medium gray - main brand color
          600: '#495057',  // Rich dark gray
          700: '#343a40',  // Deep charcoal for text
          800: '#212529',  // Near black for high contrast
          900: '#0d1117',  // Rich black for footer and strong elements
        },
        // Keeping some warm accents for interior design feel
        'accent-warm': {
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
      },
    },
  },
  plugins: [],
} 