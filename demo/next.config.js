const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@townhall-gg/marquee", "@townhall-gg/marquee-react"],
  turbopack: {
    root: path.resolve(__dirname, ".."),
  },
};

module.exports = nextConfig;
