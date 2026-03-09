import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/voxelized-physics",
  images: { unoptimized: true },
  turbopack: {},
};

export default nextConfig;
