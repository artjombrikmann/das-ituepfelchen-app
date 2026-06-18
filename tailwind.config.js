/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          700: '#705671',
        },
        brown: '#895029',
        green: '#006d2f',
        cream: '#fbf9f7',
        gray: {
          50: '#efedec',
          200: '#d4d2cf',
          600: '#4c454b',
          900: '#1b1c1b',
        }
      },
      fontFamily: {
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}