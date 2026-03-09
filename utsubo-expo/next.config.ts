import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/utsubo-expo",
  images: { unoptimized: true },
  turbopack: {},
};

export default nextConfig;
