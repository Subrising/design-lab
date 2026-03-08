import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/aurora",
  images: { unoptimized: true },
  /* config options here */
};

export default nextConfig;
