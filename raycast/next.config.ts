import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/raycast",
  images: { unoptimized: true },
};

export default nextConfig;
