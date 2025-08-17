import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import PageTransition from '@/components/PageTransition'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SeungSik Hong - Developer Blog',
  description: '개발자 홍승식의 기술 블로그입니다. Next.js, React, TypeScript 등 프론트엔드 개발 관련 글을 공유합니다.',
  keywords: ['개발자', '블로그', 'Next.js', 'React', 'TypeScript', '프론트엔드'],
  authors: [{ name: 'SeungSik Hong' }],
  creator: 'SeungSik Hong',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://seungsikhong.github.io',
    title: 'SeungSik Hong - Developer Blog',
    description: '개발자 홍승식의 기술 블로그입니다.',
    siteName: 'SeungSik Hong Blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SeungSik Hong - Developer Blog',
    description: '개발자 홍승식의 기술 블로그입니다.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300 antialiased font-sans">
        <ThemeProvider>
          <PageTransition>
            {children}
          </PageTransition>
        </ThemeProvider>
      </body>
    </html>
  )
}