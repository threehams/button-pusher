const DEV = process.env.NODE_ENV !== "production";

console.log("come on really");
module.exports = {
  presets: ["next/babel", "@emotion/babel-preset-css-prop"],
  plugins: [
    "@emotion/babel-plugin",
    DEV && "react-anonymous-display-name",
  ].filter(Boolean),
};
