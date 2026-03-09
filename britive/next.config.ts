import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/britive",
  images: { unoptimized: true },
};

export default nextConfig;
