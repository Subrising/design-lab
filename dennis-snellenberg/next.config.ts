import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/dennis-snellenberg",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
