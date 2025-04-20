/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // זה יתעלם משגיאות ESLint בזמן הבנייה
  },
}

module.exports = nextConfig 