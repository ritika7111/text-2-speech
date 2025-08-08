import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  swcMinify: true,
  output: "export",
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
