import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/voxelized-physics",
  images: { unoptimized: true },
  turbopack: {},
};

export default nextConfig;
