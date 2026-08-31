import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: process.env.IMAGE_CDN_URL
      ? [new URL(process.env.IMAGE_CDN_URL)]
      : [],
  },
};

export default nextConfig;
