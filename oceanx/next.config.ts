import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/oceanx",
  images: { unoptimized: true },
};

export default nextConfig;
