/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', "serif"],
        cormorant: ['"Cormorant Garamond"', "serif"],
        vibes: ['"Great Vibes"', "cursive"],
        amiri: ['"Amiri"', "serif"],
      },
    },
  },
  plugins: [],
};
