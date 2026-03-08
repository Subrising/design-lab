import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/obsidian",
  images: { unoptimized: true },
  /* config options here */
};

export default nextConfig;
