import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",        // static HTML export for GitHub Pages
  images: {
    unoptimized: true,     // required for static export (no server-side image opt)
  },
};

export default nextConfig;
