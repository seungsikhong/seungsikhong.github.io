import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SeungSik Hong - Developer Blog',
  description: 'Personal blog about web development, programming, and tech',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-white">
        {children}
      </body>
    </html>
  )
}