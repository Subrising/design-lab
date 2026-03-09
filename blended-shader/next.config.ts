import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/blended-shader",
  images: { unoptimized: true },
};

export default nextConfig;
