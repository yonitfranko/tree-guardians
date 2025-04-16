/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i.imgur.com'],
  },
  eslint: {
    ignoreDuringBuilds: true, // זה יתעלם משגיאות ESLint בזמן הבנייה
  },
}

module.exports = nextConfig 