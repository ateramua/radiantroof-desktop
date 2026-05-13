/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Core static export configuration
  output: 'export',
  trailingSlash: true,
  
  // ✅ Images must be unoptimized for static export
  images: { 
    unoptimized: true 
  },
  
  // ✅ CRITICAL for Electron file:// protocol
  assetPrefix: './',
  basePath: '',
  
  // Disable SWC for workspace compatibility
  swcMinify: false,
};

export default nextConfig;