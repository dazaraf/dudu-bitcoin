import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/post-generator/**/*": ["./content/post-generator/**/*"],
  },
};

export default nextConfig;
