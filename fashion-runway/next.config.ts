import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/fashion-runway",
  images: { unoptimized: true },
};

export default nextConfig;
