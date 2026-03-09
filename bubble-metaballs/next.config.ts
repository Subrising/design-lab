import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/bubble-metaballs",
  images: { unoptimized: true },
};

export default nextConfig;
