const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../libs/**/*.{ts,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      black: "#000000",
      gray: colors.gray,
      white: "#ffffff",
      red: colors.red,
    },
  },
  plugins: [],
};
