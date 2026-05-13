/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  images: {
    unoptimized: true,
  },

  trailingSlash: true,

  async rewrites() {
    if (!isDev) return [];

    // Try multiple ports for the backend in case of port conflicts
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5001/api/:path*',
      },
    ];
  },

  // Disable static optimization in Electron environment
  // This ensures pages work properly when loaded from file://
  staticPageGenerationTimeout: 60,
};

export default nextConfig;