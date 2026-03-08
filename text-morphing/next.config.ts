import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/text-morphing",
  images: { unoptimized: true },
};

export default nextConfig;
