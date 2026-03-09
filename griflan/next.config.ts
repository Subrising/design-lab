import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/griflan",
  images: { unoptimized: true },
};

export default nextConfig;
