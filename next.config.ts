import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude firebase functions from build
  webpack: (config) => {
    config.externals = config.externals || {};
    config.externals['firebase-functions'] = 'firebase-functions';
    config.externals['firebase-admin'] = 'firebase-admin';
    return config;
  },
  // Ignore firebase directory during build
  outputFileTracingExcludes: {
    '*': ['./firebase/**/*'],
  },
  // Add image domains for external images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
};

export default nextConfig;
