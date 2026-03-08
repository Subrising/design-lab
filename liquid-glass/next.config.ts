import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/liquid-glass",
  images: { unoptimized: true },
};

export default nextConfig;
