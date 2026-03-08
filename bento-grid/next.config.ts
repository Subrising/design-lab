import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/bento-grid",
  images: { unoptimized: true },
};

export default nextConfig;
