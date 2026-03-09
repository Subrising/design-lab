import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/threejs-paris",
  images: { unoptimized: true },
};

export default nextConfig;
