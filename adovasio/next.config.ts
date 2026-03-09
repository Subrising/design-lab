import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/adovasio",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
