import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/unseen-studio",
  images: { unoptimized: true },
};

export default nextConfig;
