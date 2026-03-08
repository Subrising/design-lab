import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/kinetic-typography",
  images: { unoptimized: true },
};

export default nextConfig;
