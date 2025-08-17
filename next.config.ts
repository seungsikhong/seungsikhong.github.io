import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // GitBlog 최적화 설정
  distDir: 'out',
  // 타입 체크 비활성화 (빌드 속도 향상)
  typescript: {
    ignoreBuildErrors: true,
  },
  // ESLint 체크 비활성화 (빌드 속도 향상)
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default withMDX(nextConfig)