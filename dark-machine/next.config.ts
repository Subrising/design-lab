import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/dark-machine",
  images: { unoptimized: true },
};

export default nextConfig;
