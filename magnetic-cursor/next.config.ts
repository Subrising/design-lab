import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/magnetic-cursor",
  images: { unoptimized: true },
  /* config options here */
};

export default nextConfig;
