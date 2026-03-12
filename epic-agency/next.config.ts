import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/epic-agency",
  images: { unoptimized: true },
  turbopack: {},
};

export default nextConfig;
