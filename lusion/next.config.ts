import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/lusion",
  images: { unoptimized: true },
};

export default nextConfig;
