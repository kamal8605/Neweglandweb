import type { NextConfig } from "next";
import path from "node:path";

const configuredImagePatterns = process.env.IMAGE_CDN_URL
  ? [new URL(process.env.IMAGE_CDN_URL)]
  : [];

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "pdfjs-dist": "pdfjs-dist/legacy/build/pdf.mjs",
    },
  },
  images: {
    remotePatterns: [
      ...configuredImagePatterns,
      new URL("https://c8.alamy.com/comp/**"),
      new URL("https://erp.centralsmokedistro.com/uploads/**"),
      new URL("https://nes-gateway.cloud.bbtl.app/storage/**"),
      new URL("http://127.0.0.1:8000/storage/**"),
      new URL("http://localhost:8000/storage/**"),
    ],
    qualities: [75, 100],
  },
  webpack(config) {
    // The modern PDF.js bundle contains its own Webpack runtime and crashes
    // when Next's Webpack compiler processes it. Use PDF.js's compatibility
    // entry while preserving the same React-PDF API.
    config.resolve.alias = {
      ...config.resolve.alias,
      "pdfjs-dist$": path.resolve(
        process.cwd(),
        "node_modules/pdfjs-dist/legacy/build/pdf.mjs",
      ),
    };

    return config;
  },
};

export default nextConfig;
