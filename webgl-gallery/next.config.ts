import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/webgl-gallery",
  images: { unoptimized: true },
  turbopack: {},
};

export default nextConfig;
