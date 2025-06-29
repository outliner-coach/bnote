/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/bnote',
  assetPrefix: '/bnote/',
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    domains: ['images.clerk.dev'],
    unoptimized: true,
  },
}

module.exports = nextConfig 