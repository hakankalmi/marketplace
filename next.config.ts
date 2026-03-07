import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.protakip.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.protakip.com',
      },
    ],
  },
};

export default nextConfig;
