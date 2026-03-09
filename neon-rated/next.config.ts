import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/neon-rated",
  images: { unoptimized: true },
};

export default nextConfig;
