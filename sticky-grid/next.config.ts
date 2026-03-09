import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/sticky-grid",
  images: { unoptimized: true },
};

export default nextConfig;
