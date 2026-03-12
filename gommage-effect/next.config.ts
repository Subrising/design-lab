import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/gommage-effect",
  images: { unoptimized: true },
  turbopack: {},
};

export default nextConfig;
