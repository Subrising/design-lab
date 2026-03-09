import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/zajno-motion",
  images: { unoptimized: true },
};

export default nextConfig;
