// 좌측 카테고리 사이드바
'use client'

import { useState, useMemo } from 'react'
import {
  ChevronRight
} from 'lucide-react'
import { getAllPostsMeta, getAllCategories } from '@/utils/staticData'
import { generateCategoryMenus } from '@/utils/menuConfig'
import { getActiveMenus } from '@/utils/menuLoader'



interface LeftSidebarProps {
  isVisible: boolean
  onVisibilityChange: (visible: boolean) => void
}

export default function LeftSidebar({ isVisible, onVisibilityChange }: LeftSidebarProps) {
  const [hideTimer, setHideTimer] = useState<NodeJS.Timeout | null>(null)

  // 동적 메뉴 및 카테고리 생성
  const menuItems = useMemo(() => getActiveMenus(), [])
  const allPosts = getAllPostsMeta()
  const allCategories = getAllCategories()
  
  // 카테고리별 포스트 수 계산
  const categoryPostCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    allPosts.forEach(post => {
      counts[post.category] = (counts[post.category] || 0) + 1
    })
    return counts
  }, [allPosts])

  const categoryMenus = useMemo(() => 
    generateCategoryMenus(allCategories, categoryPostCounts), 
    [allCategories, categoryPostCounts]
  )

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

  return (
    <>
      {/* 호버 감지 영역 - 사이드바가 닫혀있을 때만 표시 */}
      {!isVisible && (
        <div
          className="
            fixed left-0 top-16 bottom-0 w-16 z-40
            bg-transparent
          "
          onMouseEnter={handleMouseEnter}
        />
      )}

      {/* 사이드바 */}
      <aside
        className={`
          fixed left-0 top-16 bottom-0 w-80 z-50
          bg-white/95 dark:bg-slate-900/95
          backdrop-blur-md border-r border-slate-200 dark:border-slate-700
          transition-all duration-300 ease-out
          ${isVisible
            ? 'translate-x-0 opacity-100'
            : '-translate-x-full opacity-0'
          }
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="p-6 h-full overflow-y-auto">
          {/* 메뉴 섹션 */}
          <div className="mb-8">
            <h2 className="
              text-lg font-bold text-slate-900 dark:text-slate-100
              transition-colors duration-300 mb-4
              select-none
            ">
              메뉴
            </h2>
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="
                    flex items-center space-x-3 p-3 rounded-lg
                    text-slate-700 dark:text-slate-200
                    hover:bg-slate-100 dark:hover:bg-slate-700
                    transition-all duration-200
                  "
                >
                  <div className="text-slate-500 dark:text-slate-400">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </a>
              ))}
            </nav>
          </div>

          {/* 구분선 */}
          <div className="border-t border-slate-200 dark:border-slate-700 mb-6"></div>

          {/* 카테고리 섹션 */}
          <div className="mb-6">
            <h2 className="
              text-lg font-bold text-slate-900 dark:text-slate-100
              transition-colors duration-300 mb-4
              select-none
            ">
              카테고리
            </h2>
            <p className="
              text-sm text-slate-500 dark:text-slate-400 mb-4
              transition-colors duration-300
              select-none
            ">
              포스트를 주제별로 찾아보세요
            </p>
            <nav className="space-y-2">
              {categoryMenus.map((category) => (
                <a
                  key={category.id}
                  href={category.href}
                  className="
                    flex items-center justify-between p-3 rounded-lg
                    text-slate-700 dark:text-slate-200
                    hover:bg-slate-100 dark:hover:bg-slate-700
                    transition-all duration-200
                  "
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-slate-500 dark:text-slate-400">
                      <category.icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{category.label}</span>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                    {category.postCount}
                  </span>
                </a>
              ))}
            </nav>
          </div>

          {/* 하단 통계 */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Total Posts
                </span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  12
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Categories
                </span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  5
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}