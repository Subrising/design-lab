import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/rive-app",
  images: { unoptimized: true },
};

export default nextConfig;
