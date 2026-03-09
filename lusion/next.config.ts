import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/lusion",
  images: { unoptimized: true },
};

export default nextConfig;
