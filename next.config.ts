import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  ...(process.env.STATIC_EXPORT === '1' && { output: 'export' }),
  devIndicators: false,
  images: {
    ...(process.env.STATIC_EXPORT === '1' && { unoptimized: true }),
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: '**', pathname: '/**' }],
  },
};

export default nextConfig;
