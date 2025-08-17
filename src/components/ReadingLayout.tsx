// 메인 읽기 레이아웃
'use client'

import { useState, useEffect, useRef } from 'react'
import { useTheme } from './ThemeProvider'
import LeftSidebar from './LeftSidebar'
import RightTOCSidebar from './RightTOCSidebar'
import FloatingMobileNav from './FloatingMobileNav'
import ReadingProgress from './ReadingProgress'

interface ReadingLayoutProps {
  children: React.ReactNode
  showSidebars?: boolean  // 메인페이지에서는 false, 포스트에서는 true
  tableOfContents?: Array<{
    id: string
    title: string
    level: number
  }>
}

export default function ReadingLayout({
  children,
  showSidebars = true,
  tableOfContents = []
}: ReadingLayoutProps) {
  const [leftSidebarVisible, setLeftSidebarVisible] = useState(false)
  const [rightSidebarVisible, setRightSidebarVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [estimatedReadTime, setEstimatedReadTime] = useState(0)
  const [currentSection, setCurrentSection] = useState('')

  const leftTriggerRef = useRef<HTMLDivElement>(null)
  const rightTriggerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // 반응형 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 읽기 진행도 계산
  useEffect(() => {
    const calculateProgress = () => {
      if (!contentRef.current) return

      const element = contentRef.current
      const windowHeight = window.innerHeight
      const documentHeight = element.scrollHeight
      const scrollTop = window.scrollY
      const docHeight = documentHeight - windowHeight

      if (docHeight <= 0) {
        setReadingProgress(100)
        return
      }

      const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100))
      setReadingProgress(progress)
    }

    const handleScroll = () => {
      calculateProgress()
      // 현재 섹션 감지 로직은 추후 구현
    }

    window.addEventListener('scroll', handleScroll)
    calculateProgress()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 예상 읽기 시간 계산
  useEffect(() => {
    if (contentRef.current) {
      const text = contentRef.current.textContent || ''
      const wordsPerMinute = 200 // 한국어 기준 분당 읽기 속도
      const words = text.length / 2 // 한국어 특성상 글자수/2로 단어 추정
      const minutes = Math.ceil(words / wordsPerMinute)
      setEstimatedReadTime(minutes)
    }
  }, [children])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* 읽기 진행도 바 */}
      <ReadingProgress progress={readingProgress} />

      {/* 데스크톱: 좌측 호버 감지 영역 */}
      {!isMobile && showSidebars && !leftSidebarVisible && (
        <div
          ref={leftTriggerRef}
          className="fixed left-0 top-0 bottom-0 w-8 z-40 bg-transparent cursor-pointer"
          onMouseEnter={() => setLeftSidebarVisible(true)}
        />
      )}

      {/* 데스크톱: 우측 호버 감지 영역 */}
      {!isMobile && showSidebars && !rightSidebarVisible && (
        <div
          ref={rightTriggerRef}
          className="fixed right-0 top-0 bottom-0 w-8 z-40 bg-transparent cursor-pointer"
          onMouseEnter={() => setRightSidebarVisible(true)}
        />
      )}

      {/* 좌측 사이드바 (카테고리/메뉴) */}
      {!isMobile && showSidebars && (
        <LeftSidebar
          isVisible={leftSidebarVisible}
          onVisibilityChange={setLeftSidebarVisible}
        />
      )}

      {/* 우측 사이드바 (목차) */}
      {!isMobile && showSidebars && (
        <RightTOCSidebar
          isVisible={rightSidebarVisible}
          onVisibilityChange={setRightSidebarVisible}
          tableOfContents={tableOfContents}
          currentSection={currentSection}
          estimatedReadTime={estimatedReadTime}
          readingProgress={readingProgress}
        />
      )}

      {/* 메인 콘텐츠 영역 */}
      <main
        ref={contentRef}
        className={`
          transition-all duration-300 ease-out
          ${showSidebars && !isMobile
            ? 'lg:mx-20' // 데스크톱에서 좌우 여백 확보
            : ''
          }
          ${!showSidebars ? 'pt-16' : ''} // 메인페이지일 때만 상단 패딩
        `}
      >
        <div className="max-w-4xl mx-auto">
          {/* 독서 최적화된 콘텐츠 */}
          <div className={`
            px-4 py-8 lg:px-8
            ${showSidebars ? 'prose prose-lg dark:prose-invert max-w-none' : ''}
            prose-headings:scroll-mt-20
            prose-a:text-blue-600 dark:prose-a:text-blue-400
            prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-blue-500
            prose-code:bg-gray-100 dark:prose-code:bg-slate-800
            prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-slate-900 dark:prose-pre:bg-slate-800
          `}>
            {children}
          </div>
        </div>
      </main>

      {/* 모바일 플로팅 네비게이션 */}
      {isMobile && showSidebars && (
        <FloatingMobileNav
          tableOfContents={tableOfContents}
          readingProgress={readingProgress}
          estimatedReadTime={estimatedReadTime}
        />
      )}

      {/* 모바일에서 사이드바가 열릴 때 배경 오버레이 */}
      {isMobile && (leftSidebarVisible || rightSidebarVisible) && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => {
            setLeftSidebarVisible(false)
            setRightSidebarVisible(false)
          }}
        />
      )}
    </div>
  )
}