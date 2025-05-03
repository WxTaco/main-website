/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wrapped-pink': '#FF69B4',
        'wrapped-yellow': '#FFD700',
        'wrapped-green': '#98FB98',
        'wrapped-blue': '#87CEEB',
        'pastel-blue': '#A6D1E6',
        'invomagic-blue': '#2457ff',
      },
      fontFamily: {
        'saira': ['Saira', 'sans-serif'],
      },
    },
  },
  plugins: [],
}