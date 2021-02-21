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
    if (!isServer) {
      config.plugins.push(
        new WorkerPlugin({
          // use "self" as the global object when receiving hot updates.
          globalObject: "self",
        }),
      );
    }
    config.resolve.alias["lodash"] = "lodash-es";

    return config;
  },
});
