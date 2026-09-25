const { WIDTHS } = require("./src/lib/image-widths.json");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/Short-Term-Rentals",
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    // Serves pre-built resized variants - see src/lib/image-loader.js.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.js",
    deviceSizes: WIDTHS.filter((w) => w >= 480),
    imageSizes: WIDTHS.filter((w) => w < 480),
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: "/Short-Term-Rentals",
  },
};

module.exports = nextConfig;
