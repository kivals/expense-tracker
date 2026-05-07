import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@expense-tracker/shared-types"],
};

export default nextConfig;
