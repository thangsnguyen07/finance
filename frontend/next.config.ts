import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    const rawBackendUrl =
      process.env['BACKEND_API_URL'] ||
      process.env['NEXT_PUBLIC_API_URL'] ||
      'http://localhost:4000';
    // Strip trailing slash if present
    const backendUrl = rawBackendUrl.replace(/\/+$/, '');

    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
