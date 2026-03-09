import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/ohzi-interactive",
  images: { unoptimized: true },
};

export default nextConfig;
