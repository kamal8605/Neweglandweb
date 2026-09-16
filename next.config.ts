import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    instantInsights: {
      validationLevel: "warning",
    },
  },
  images: {
    qualities: [75, 100],
    remotePatterns: process.env.IMAGE_CDN_URL
      ? [new URL(process.env.IMAGE_CDN_URL)]
      : [],
  },
};

export default nextConfig;
