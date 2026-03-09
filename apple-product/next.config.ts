import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/apple-product",
  images: { unoptimized: true },
};

export default nextConfig;
