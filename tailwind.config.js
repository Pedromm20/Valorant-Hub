/** @type {import('tailwindcss').Config} */
module.exports = {
  lightMode:'class',
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        black: "#0F1923",
        red: "#FF4655",
        gray: "#A9A9A9",
        darkGray: "#1A1A1A",
        lightRed: "#FFC0CB",
      },
    },
  },
  plugins: [],
};
