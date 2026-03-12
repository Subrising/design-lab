import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/procedural-snake",
  images: { unoptimized: true },
  turbopack: {},
};

export default nextConfig;
