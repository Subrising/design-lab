import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/d2c-rubiks",
  images: { unoptimized: true },
};

export default nextConfig;
