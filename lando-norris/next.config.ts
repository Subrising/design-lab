import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/lando-norris",
  images: { unoptimized: true },
};

export default nextConfig;
