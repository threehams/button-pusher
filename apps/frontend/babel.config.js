const DEV = process.env.NODE_ENV !== "production";

module.exports = {
  presets: ["next/babel"],
  plugins: [DEV && "react-anonymous-display-name"].filter(Boolean),
};
