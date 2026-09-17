import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    instantInsights: {
      validationLevel: "manual-warning",
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
