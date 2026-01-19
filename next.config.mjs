/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    proxyTimeout: 300000, // 5 minutes
  },
  serverRuntimeConfig: {
    maxDuration: 300,
  },
};

export default nextConfig;
