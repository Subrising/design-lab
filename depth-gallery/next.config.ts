import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/depth-gallery",
  images: { unoptimized: true },
};

export default nextConfig;
