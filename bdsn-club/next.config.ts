import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/bdsn-club",
  images: { unoptimized: true },
};

export default nextConfig;
