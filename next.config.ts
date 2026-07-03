import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'materialspro-media.s3.us-west-1.amazonaws.com',
        port: '',
        pathname: '/godump-images/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'materialspro-media.s3.us-west-1.amazonaws.com',
        port: '',
        pathname: '/uploads/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
