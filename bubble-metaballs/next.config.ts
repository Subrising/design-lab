import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/bubble-metaballs",
  images: { unoptimized: true },
};

export default nextConfig;
