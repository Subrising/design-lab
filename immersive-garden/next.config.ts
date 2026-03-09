import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/immersive-garden",
  images: { unoptimized: true },
};

export default nextConfig;
