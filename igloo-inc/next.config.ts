import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/igloo-inc",
  images: { unoptimized: true },
};

export default nextConfig;
