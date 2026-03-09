import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/linear",
  images: { unoptimized: true },
};

export default nextConfig;
