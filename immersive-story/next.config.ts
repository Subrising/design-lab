import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/immersive-story",
  images: { unoptimized: true },
};

export default nextConfig;
