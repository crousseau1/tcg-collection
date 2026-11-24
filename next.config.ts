import type { NextConfig } from "next";

const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  outputFileTracingIncludes: {
    "/api/*": ["./data/**/*"],
  },
};

if (staticExport) {
  nextConfig.output = "export";
  nextConfig.basePath = "/tcg-collection";
  nextConfig.trailingSlash = true;
}

export default nextConfig;
