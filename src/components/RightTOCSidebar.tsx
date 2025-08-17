// 우측 목차 사이드 바
'use client'

import { useState } from 'react'
import { Clock, Share2, BookOpen, BarChart3 } from 'lucide-react'

interface TOCItem {
  id: string
  title: string
  level: number
}

interface RightTOCSidebarProps {
  isVisible: boolean
  onVisibilityChange: (visible: boolean) => void
  tableOfContents: TOCItem[]
  currentSection: string
  estimatedReadTime: number
  readingProgress: number
}

export default function RightTOCSidebar({
  isVisible,
  onVisibilityChange,
  tableOfContents,
  currentSection,
  estimatedReadTime,
  readingProgress
}: RightTOCSidebarProps) {
  const [hideTimer, setHideTimer] = useState<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (hideTimer) {
      clearTimeout(hideTimer)
      setHideTimer(null)
    }
    onVisibilityChange(true)
  }

  const handleMouseLeave = () => {
    const timer = setTimeout(() => {
      onVisibilityChange(false)
    }, 1000)
    setHideTimer(timer)
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const headerOffset = 80 // 헤더 높이 고려
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      // 폴백: 클립보드에 복사
      navigator.clipboard.writeText(window.location.href)
      // TODO: 토스트 알림 추가
    }
  }

  return (
    <aside
      className={`
        fixed right-0 top-0 bottom-0 w-80 z-50
        bg-white/95 dark:bg-slate-900/95
        backdrop-blur-md border-l border-gray-200 dark:border-slate-700
        transition-all duration-300 ease-out shadow-lg
        ${isVisible
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
        }
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-6 h-full overflow-y-auto">
        {/* 헤더 영역 */}
        <div className="mb-6">
          <h2 className="
            text-lg font-bold text-slate-900 dark:text-slate-100
            flex items-center space-x-2
          ">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <span>Table of Contents</span>
          </h2>
        </div>

        {/* 읽기 정보 카드 */}
        <div className="
          mb-6 p-4 rounded-lg
          bg-blue-50 dark:bg-slate-800
          border border-blue-200 dark:border-slate-600
        ">
          <div className="space-y-3">
            {/* 예상 읽기 시간 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <Clock className="w-4 h-4" />
                <span>예상 읽기 시간</span>
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {estimatedReadTime}분
              </span>
            </div>

            {/* 읽기 진행도 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                  <BarChart3 className="w-4 h-4" />
                  <span>읽기 진행도</span>
                </div>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {Math.round(readingProgress)}%
                </span>
              </div>

              {/* 진행도 바 */}
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${readingProgress}%` }}
                />
              </div>

              {/* 남은 시간 */}
              {readingProgress > 0 && (
                <div className="text-xs text-slate-500 dark:text-slate-400 text-right">
                  약 {Math.ceil(estimatedReadTime * (100 - readingProgress) / 100)}분 남음
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 목차 리스트 */}
        {tableOfContents.length > 0 && (
          <nav className="mb-6">
            <div className="space-y-1">
              {tableOfContents.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg text-sm
                    transition-all duration-200
                    hover:bg-slate-100 dark:hover:bg-slate-700
                    ${item.level === 1 ? 'font-semibold' : ''}
                    ${item.level === 2 ? 'ml-4 font-medium' : ''}
                    ${item.level === 3 ? 'ml-8' : ''}
                    ${item.level >= 4 ? 'ml-12 text-xs' : ''}
                    ${currentSection === item.id
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-l-2 border-blue-500'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }
                  `}
                >
                  {/* 목차 번호 */}
                  <span className="inline-block w-6 text-xs text-slate-400 dark:text-slate-500">
                    {item.level === 1 ? index + 1 + '.' : ''}
                  </span>

                  {/* 목차 제목 */}
                  <span className="truncate block">
                    {item.title}
                  </span>
                </button>
              ))}
            </div>
          </nav>
        )}

        {/* 목차가 없는 경우 */}
        {tableOfContents.length === 0 && (
          <div className="mb-6 p-4 text-center text-slate-500 dark:text-slate-400 text-sm">
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>목차를 생성 중입니다...</p>
          </div>
        )}

        {/* 액션 버튼들 */}
        <div className="space-y-3">
          {/* 공유 버튼 */}
          <button
            onClick={handleShare}
            className="
              w-full flex items-center justify-center space-x-2 p-3
              bg-slate-100 dark:bg-slate-800
              hover:bg-slate-200 dark:hover:bg-slate-700
              rounded-lg transition-colors duration-200
              text-slate-600 dark:text-slate-400
              hover:text-slate-900 dark:hover:text-slate-200
            "
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium">글 공유하기</span>
          </button>

          {/* 처음으로 버튼 */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="
              w-full flex items-center justify-center space-x-2 p-3
              bg-blue-50 dark:bg-blue-900/30
              hover:bg-blue-100 dark:hover:bg-blue-900/50
              rounded-lg transition-colors duration-200
              text-blue-600 dark:text-blue-400
              hover:text-blue-700 dark:hover:text-blue-300
            "
          >
            <span className="text-sm font-medium">처음으로 이동</span>
          </button>
        </div>

        {/* 하단 정보 */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="text-xs text-slate-400 dark:text-slate-500 text-center space-y-1">
            <p>💡 Tip: 헤딩을 클릭하면 해당 섹션으로 이동합니다</p>
            <p>🖱️ 마우스가 벗어나면 메뉴가 숨겨집니다</p>
          </div>
        </div>
      </div>
    </aside>
  )
}