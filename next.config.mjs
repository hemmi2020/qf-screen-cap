/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    proxyTimeout: 120000, // 2 minutes (max for free tier)
  },
};

export default nextConfig;
