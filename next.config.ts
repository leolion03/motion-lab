import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three"],
  async redirects() {
    return [
      { source: "/animation/mobius-loom", destination: "/animation/mobius-loop", permanent: true },
      { source: "/zh/animation/mobius-loom", destination: "/zh/animation/mobius-loop", permanent: true },
    ];
  },
};
export default nextConfig;
