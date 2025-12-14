const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.resolve(__dirname),
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false
      }
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: 'i.ibb.co',
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: 'res.cloudinary.com',
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: 'lh3.googleusercontent.com',
        pathname: "**",
      },
    ],
  },
}

module.exports = nextConfig
