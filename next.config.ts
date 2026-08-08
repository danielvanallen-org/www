import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
  agentRules: false,
  cacheComponents: true,
  output: "standalone",
  reactCompiler: true,
}
 
export default nextConfig
