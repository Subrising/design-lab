import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "",
  images: { unoptimized: true },
  turbopack: {},
};

export default nextConfig;
