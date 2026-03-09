import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/pudding-motifs",
  images: { unoptimized: true },
};

export default nextConfig;
