import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/active-theory",
  images: { unoptimized: true },
  turbopack: {},
};

export default nextConfig;
