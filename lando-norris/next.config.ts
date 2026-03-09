import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-lab/lando-norris",
  images: { unoptimized: true },
};

export default nextConfig;
