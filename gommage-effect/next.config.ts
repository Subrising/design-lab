import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/gommage-effect",
  images: { unoptimized: true },
  turbopack: {},
};

export default nextConfig;
