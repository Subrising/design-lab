import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/raycast",
  images: { unoptimized: true },
};

export default nextConfig;
