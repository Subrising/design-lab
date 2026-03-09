import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/cartier-watches",
  images: { unoptimized: true },
};

export default nextConfig;
