const path = require("path");
const appRootPath = require("app-root-path").toString();

module.exports = {
  assetPrefix: "",
  async exportPathMap() {
    return {
      "/": { page: "/" },
    };
  },
  typescript: {
    ignoreDevErrors: true,
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.module.rules[1].include.unshift(path.resolve(appRootPath, "libs"));
    config.resolve.alias["lodash"] = "lodash-es";
    if (process.env.PROFILE) {
      config.resolve.alias["react-dom$"] = "react-dom/profiling";
      config.resolve.alias["scheduler/tracing"] = "scheduler/tracing-profiling";
      config.optimization.minimize = false;
    }

    return config;
  },
};
