import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com"],
  },
};

module.exports = nextConfig;

export default nextConfig;
