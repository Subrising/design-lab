import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/neon-rated",
  images: { unoptimized: true },
};

export default nextConfig;
