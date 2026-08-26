import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '24afyc8tjg892mmr.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;