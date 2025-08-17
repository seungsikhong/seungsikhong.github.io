'use client'

import { useState } from 'react'
import { 
  Menu, 
  BookOpen, 
  Home, 
  Share2, 
  Moon, 
  Sun,
  ChevronUp,
  X,
  Clock,
  BarChart3
} from 'lucide-react'
import { useTheme } from './ThemeProvider'

interface TOCItem {
  id: string
  title: string
  level: number
}

interface FloatingMobileNavProps {
  tableOfContents: TOCItem[]
  readingProgress: number
  estimatedReadTime: number
}

export default function FloatingMobileNav({
  tableOfContents,
  readingProgress,
  estimatedReadTime
}: FloatingMobileNavProps) {
  const { theme, toggleTheme } = useTheme()
  const [showTOC, setShowTOC] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
    setShowTOC(false)
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
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {showTOC && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowTOC(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] bg-white dark:bg-slate-900 rounded-t-2xl shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Table of Contents</h3>
              </div>
              <button onClick={() => setShowTOC(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-sm text-slate-600 dark:text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span>{estimatedReadTime}분</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400">
                    <BarChart3 className="w-4 h-4" />
                    <span>{Math.round(readingProgress)}%</span>
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${readingProgress}%` }} />
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto p-4">
              {tableOfContents.length > 0 ? (
                <div className="space-y-1">
                  {tableOfContents.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="w-full text-left px-3 py-3 rounded-lg transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                    >
                      <div className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1 text-xs">
                          {item.level === 1 ? `${index + 1}.` : '•'}
                        </span>
                        <span className="flex-1">{item.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>목차를 생성 중입니다...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMenu(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-2xl shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center space-x-2">
                <Menu className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Menu</h3>
              </div>
              <button onClick={() => setShowMenu(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-4 space-y-2">
              <a href="/" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <Home className="w-5 h-5 text-slate-500" />
                <span className="text-slate-700 dark:text-slate-300">홈으로 이동</span>
              </a>
              <button onClick={handleShare} className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <Share2 className="w-5 h-5 text-slate-500" />
                <span className="text-slate-700 dark:text-slate-300">글 공유하기</span>
              </button>
              <button onClick={toggleTheme} className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                {theme === 'light' ? <Moon className="w-5 h-5 text-slate-500" /> : <Sun className="w-5 h-5 text-slate-500" />}
                <span className="text-slate-700 dark:text-slate-300">
                  {theme === 'light' ? '다크 모드' : '라이트 모드'}
                </span>
              </button>
              <button onClick={scrollToTop} className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <ChevronUp className="w-5 h-5 text-slate-500" />
                <span className="text-slate-700 dark:text-slate-300">처음으로 이동</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-4 left-4 right-4 z-40 lg:hidden flex items-center justify-center">
        <div className="flex items-center space-x-1 p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-slate-700/50 shadow-lg">
          <button onClick={() => setShowTOC(true)} className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200 text-blue-600 dark:text-blue-400">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium">목차</span>
          </button>
          <div className="w-px h-6 bg-gray-300 dark:bg-slate-600" />
          <button onClick={() => setShowMenu(true)} className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 text-slate-600 dark:text-slate-400">
            <Menu className="w-4 h-4" />
            <span className="text-sm font-medium">메뉴</span>
          </button>
          <div className="w-px h-6 bg-gray-300 dark:bg-slate-600" />
          <div className="flex items-center space-x-2 px-4 py-2">
            <div className="w-8 h-1 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${readingProgress}%` }} />
            </div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 min-w-[2rem]">
              {Math.round(readingProgress)}%
            </span>
          </div>
        </div>
      </div>
    </>
  )
}