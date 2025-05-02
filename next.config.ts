/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/creators/:path*',
        destination: 'http://localhost:8000/creators/:path*'
      }
    ]
  },
}
module.exports = nextConfig
