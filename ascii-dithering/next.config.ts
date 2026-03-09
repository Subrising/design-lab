import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/ascii-dithering",
  images: { unoptimized: true },
};

export default nextConfig;
