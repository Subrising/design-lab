import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/pudding-motifs",
  images: { unoptimized: true },
};

export default nextConfig;
