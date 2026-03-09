import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/messenger-meta",
  images: { unoptimized: true },
  turbopack: {},
};

export default nextConfig;
