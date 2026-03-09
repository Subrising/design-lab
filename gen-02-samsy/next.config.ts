import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/gen-02-samsy",
  images: { unoptimized: true },
  turbopack: {},
};

export default nextConfig;
