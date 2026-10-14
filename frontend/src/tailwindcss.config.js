/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        backgroundLight: "#f6f8f6",
        textMain: "#101914",
        textSide: "#006400",
        primary: "#13ec13",
        borderLight: "#e7f3e7",
        borderActive: "#cfe7cf",
      },

      fontFamily: {
        sans: ['Inter', 'sans-serif'],   
      },
    },
  },

  plugins: [],
};