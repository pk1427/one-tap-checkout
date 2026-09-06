/** @type {import('next').NextConfig} */
import path from 'path';

const nextConfig = {
  transpilePackages: ['@privy-io/react-auth', '@privy-io/js-sdk-core', 'permissionless', 'ox'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        react: path.resolve('./node_modules/react'),
        'react-dom': path.resolve('./node_modules/react-dom'),
      };
    }
    return config;
  },
};

export default nextConfig;