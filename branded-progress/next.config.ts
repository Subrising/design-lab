import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/branded-progress",
  images: { unoptimized: true },
};

export default nextConfig;
