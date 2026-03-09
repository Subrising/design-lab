import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/text-destruction",
  images: { unoptimized: true },
  turbopack: {},
};

export default nextConfig;
