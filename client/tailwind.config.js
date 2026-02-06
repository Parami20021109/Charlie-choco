/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chocolate: {
          900: '#3E2723', // Very dark brown
          800: '#4E342E',
          700: '#5D4037',
          600: '#6D4C41',
          500: '#795548',
          400: '#8D6E63', // Milk chocolate
          300: '#A1887F',
          200: '#BCAAA4',
          100: '#D7CCC8', // White chocolate
          50: '#EFEBE9',
        },
        gold: {
          500: '#FFD700',
          600: '#DAA520',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
