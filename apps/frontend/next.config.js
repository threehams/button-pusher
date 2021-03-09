const path = require("path");
const WorkerPlugin = require("worker-plugin");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const appRootPath = require("app-root-path").toString();

module.exports = {
  assetPrefix: "",
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId },
  ) {
    return {
      "/": { page: "/" },
    };
  },
  typescript: {
    ignoreDevErrors: true,
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    config.module.rules[0].include.unshift(path.resolve(appRootPath, "libs"));
    config.resolve.alias["lodash"] = "lodash-es";
    if (process.env.PROFILE) {
      config.resolve.alias["react-dom$"] = "react-dom/profiling";
      config.resolve.alias["scheduler/tracing"] = "scheduler/tracing-profiling";
      config.optimization.minimize = false;
    }

    return config;
  },
};
