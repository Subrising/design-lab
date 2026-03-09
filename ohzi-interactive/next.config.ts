import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/ohzi-interactive",
  images: { unoptimized: true },
};

export default nextConfig;
