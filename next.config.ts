import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
  cacheComponents: true,
  output: "standalone",
  reactCompiler: true,

  async redirects() {
    return [
      {
        source: '/:any*',
        has: [
          {
            type: 'host',
            value: '(www\\.)?cryptcolors\\.com',
          },
        ],
        destination: '/cryptcolors',
        permanent: false,
      },
    ]
  },
}
 
export default nextConfig
