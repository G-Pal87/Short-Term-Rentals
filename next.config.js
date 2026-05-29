/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/Short-Term-Rentals",
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
