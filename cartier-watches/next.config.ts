import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/cartier-watches",
  images: { unoptimized: true },
};

export default nextConfig;
