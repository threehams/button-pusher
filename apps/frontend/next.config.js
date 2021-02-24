const path = require("path");
const WorkerPlugin = require("worker-plugin");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
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
    config.resolve.alias["lodash"] = "lodash-es";

    return config;
  },
});
