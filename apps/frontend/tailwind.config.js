module.exports = {
  mode: "jit",
  purge: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../libs/**/*.{ts,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    // colors: {
    //   gray: "#343434",
    // },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
