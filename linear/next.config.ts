import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/linear",
  images: { unoptimized: true },
};

export default nextConfig;
