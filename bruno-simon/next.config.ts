import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/bruno-simon",
  images: { unoptimized: true },
  turbopack: {},
};

export default nextConfig;
