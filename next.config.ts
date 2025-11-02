import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
  cacheComponents: true,
  output: "standalone",
  reactCompiler: true,

  // Save some money by doing this redirect with NextJS instead of using a load balancer.
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
        destination: 'https://danielvanallen.org/cryptcolors',
        permanent: false,
      },
    ]
  },
}
 
export default nextConfig
