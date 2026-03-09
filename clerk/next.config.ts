import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/clerk",
  images: { unoptimized: true },
};

export default nextConfig;
