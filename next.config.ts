import type { NextConfig } from "next";
import path from "path";

// Safely parse the API URL from environment variables for image optimization
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
let apiHostname = "127.0.0.1";
let apiPort = "8000";
let apiProtocol = "http";

try {
  const parsedUrl = new URL(apiUrl);
  apiHostname = parsedUrl.hostname;
  apiPort = parsedUrl.port || ""; // Empty string means default port for protocol
  apiProtocol = parsedUrl.protocol.replace(':', '');
} catch (e) {
  console.warn("Could not parse NEXT_PUBLIC_API_URL for image domains");
}

const nextConfig: NextConfig = {
  images: {
    unoptimized: process.env.NODE_ENV === "development",
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: apiProtocol as "http" | "https",
        hostname: apiHostname,
        port: apiPort,
      },
      // Local fallbacks just in case
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      }
    ],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  webpack(config, { dev }) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
