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
};

export default nextConfig;
