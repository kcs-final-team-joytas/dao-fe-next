/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.joytas.io',
      },
    ],
  },
}

module.exports = nextConfig
