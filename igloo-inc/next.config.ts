import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/igloo-inc",
  images: { unoptimized: true },
};

export default nextConfig;
