const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.resolve(__dirname),
  reactStrictMode: true,
  sassOptions: {
    includePaths: [
      path.join(__dirname, 'node_modules'),
      path.join(__dirname, 'node_modules/bootstrap/scss'),
    ],
    // Silence the deprecation warning
    silenceDeprecations: ['legacy-js-api'],
  },
  webpack: (config) => {
    // Ensure proper resolution for SCSS imports
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
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
        hostname: 'img.youtube.com',
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: 'i.ytimg.com',
        pathname: "**",
      },
    ],
  },
}

module.exports = nextConfig
