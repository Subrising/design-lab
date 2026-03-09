import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/britive",
  images: { unoptimized: true },
};

export default nextConfig;
