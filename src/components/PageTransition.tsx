// 페이지 전환 애니메이션 (첫 방문자에게만)
'use client'

import { useEffect, useState } from 'react'
import { hasVisitedBefore, markAsVisited } from '@/utils/cookies'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isFirstVisit, setIsFirstVisit] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // 첫 방문자인지 확인
    const firstVisit = !hasVisitedBefore()
    setIsFirstVisit(firstVisit)
    
    if (firstVisit) {
      // 첫 방문자인 경우에만 애니메이션 실행
      const timer = setTimeout(() => {
        setIsLoaded(true)
        // 애니메이션 완료 후 방문 기록
        setTimeout(() => {
          markAsVisited()
        }, 1500) // 애니메이션 완료 후 기록
      }, 100)
      
      return () => clearTimeout(timer)
    } else {
      // 재방문자인 경우 즉시 로드
      setIsLoaded(true)
    }
  }, [])

  // SSR 중에는 애니메이션 없이 렌더링
  if (!isClient) {
    return <>{children}</>
  }

  // 재방문자인 경우 애니메이션 없이 바로 콘텐츠 표시
  if (!isFirstVisit) {
    return <>{children}</>
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 좌측 커튼 */}
      <div
        className={`
          fixed inset-y-0 left-0 w-1/2 z-[60]
          bg-gradient-to-r from-slate-900 to-slate-800
          transition-transform duration-1000 ease-out
          ${isLoaded ? '-translate-x-full' : 'translate-x-0'}
        `}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-right pr-8">
            <div className="w-16 h-16 rounded-full bg-primary-500 mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-xl">SH</span>
            </div>
            <div className="text-white/80 text-sm">Welcome!</div>
          </div>
        </div>
      </div>

      {/* 우측 커튼 */}
      <div
        className={`
          fixed inset-y-0 right-0 w-1/2 z-[60]
          bg-gradient-to-l from-slate-900 to-slate-800
          transition-transform duration-1000 ease-out
          ${isLoaded ? 'translate-x-full' : 'translate-x-0'}
        `}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-left pl-8">
            <div className="w-2 h-16 bg-primary-500 mb-4"></div>
            <div className="text-white/60 text-xs uppercase tracking-wider">
              Developer Blog
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div
        className={`
          transition-all duration-1000 ease-out delay-500
          ${isLoaded
            ? 'opacity-100 transform translate-y-0'
            : 'opacity-0 transform translate-y-4'
          }
        `}
      >
        {children}
      </div>
    </div>
  )
}