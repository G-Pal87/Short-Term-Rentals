/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/Short-Term-Rentals",
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: "/Short-Term-Rentals",
  },
};

module.exports = nextConfig;
