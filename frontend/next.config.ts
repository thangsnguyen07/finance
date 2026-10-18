import type { NextConfig } from 'next';

const BACKEND_API_URL = (
  process.env['BACKEND_API_URL'] ?? 'http://localhost:4000'
).replace(/\/+$/, '');

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${BACKEND_API_URL}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
