import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/creative-studio",
  images: { unoptimized: true },
};

export default nextConfig;
