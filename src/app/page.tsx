'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import LeftSidebar from '@/components/LeftSidebar'
import { ArrowRight, TrendingUp, Eye, Clock } from 'lucide-react'
import { getAllPostsMeta } from '@/utils/staticData'

export default function Home() {
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarVisible, setSidebarVisible] = useState(false)
  
  // 정적 데이터에서 포스트 가져오기
  const allPosts = getAllPostsMeta()
  const samplePosts = allPosts.slice(0, 3) // 최신 3개
  const popularPosts = allPosts.slice(0, 3) // 임시로 최신 3개 (나중에 조회수 기반으로 변경)

  useEffect(() => {
    // 다크모드 초기값 설정
    const isDark = localStorage.getItem('theme') === 'dark' ||
                   (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setDarkMode(isDark)

    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`
    }
    return views.toString()
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* 좌측 사이드바 */}
      <LeftSidebar 
        isVisible={sidebarVisible} 
        onVisibilityChange={setSidebarVisible} 
      />

      {/* 다크모드 토글 버튼 */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 relative pt-20">
        <div className="max-w-6xl mx-auto text-center">
          {/* 메인 제목 */}
          <div className="mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent leading-[1.2] py-2">
              Code & Thoughts
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              A space where code and thoughts persist
            </p>
          </div>

          {/* 최신 포스트 섹션 */}
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <Clock className="w-6 h-6 text-blue-500 mr-3" />
              <h3 className="text-2xl font-bold">최신 포스트</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {samplePosts.map((post) => (
                <Link key={post.slug} href={`/posts/${post.slug}`}>
                  <article className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 overflow-hidden group">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                          {post.category}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {formatViews(post.views)}
                        </span>
                      </div>
                      <h4 className="font-semibold text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {post.title}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(post.date)}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>

          {/* 인기 포스트 섹션 */}
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <TrendingUp className="w-6 h-6 text-green-500 mr-3" />
              <h3 className="text-2xl font-bold">인기 포스트</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {popularPosts.map((post) => (
                <Link key={post.slug} href={`/posts/${post.slug}`}>
                  <article className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 overflow-hidden group">
                    <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {formatViews(post.views)}
                      </span>
                    </div>
                    <h4 className="font-semibold text-lg mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                      {post.title}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDate(post.date)}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </article>
                </Link>
              ))}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex justify-center items-center mb-16">
            <a
              href="#about"
              className="group px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <span>소개 보기</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>

          {/* 좌측 사이드바 안내 */}
          <div className="text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
              💡 좌측 영역에 마우스를 올려보세요
            </p>
            <div className="flex items-center justify-center space-x-2 text-xs text-slate-400 dark:text-slate-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>카테고리 메뉴가 나타납니다</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4 bg-gray-100 dark:bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-6">About Me</h3>
            <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h4 className="text-2xl font-semibold">웹 개발자 홍승식</h4>

              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                사용자 경험을 중시하며, 성능 최적화와 코드 품질에 관심이 많습니다.
                특히 <strong>읽기에 집중할 수 있는 인터페이스</strong>를 만드는 것을 좋아하며,
                새로운 기술 트렌드를 빠르게 학습하고 프로젝트에 적용하는 것을 즐깁니다.
              </p>

              <div className="space-y-4">
                <h5 className="font-semibold">주요 기술 스택</h5>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                    Next.js 15
                  </span>
                  <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                    TypeScript
                  </span>
                  <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                    React 18
                  </span>
                  <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                    Tailwind CSS
                  </span>
                  <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                    Node.js
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-700 p-8 rounded-2xl shadow-lg">
                <h5 className="text-xl font-semibold mb-4">🚧 현재 작업 중인 프로젝트</h5>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <span className="text-blue-500 mt-1">•</span>
                    <span className="text-slate-600 dark:text-slate-400">
                      몰입형 독서 블로그 (Next.js 15 + TypeScript)
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-blue-500 mt-1">•</span>
                    <span className="text-slate-600 dark:text-slate-400">
                      MDX 기반 글쓰기 시스템 개발
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-blue-500 mt-1">•</span>
                    <span className="text-slate-600 dark:text-slate-400">
                      웹 성능 최적화 및 접근성 개선 연구
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 p-6 rounded-2xl border border-blue-200 dark:border-slate-600">
                <h5 className="text-lg font-semibold mb-3">📈 블로그 철학</h5>
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <p className="flex items-center space-x-2">
                    <span className="text-blue-500">🎯</span>
                    <span>읽기에만 집중할 수 있는 인터페이스</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <span className="text-green-500">📱</span>
                    <span>모든 기기에서 최적화된 경험</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <span className="text-purple-500">⚡</span>
                    <span>빠른 로딩과 부드러운 애니메이션</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">H2S</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">SeungSik Hong</h3>
            <p className="text-slate-400">Full Stack Developer</p>
          </div>

          <div className="border-t border-slate-800 pt-6">
            <p className="text-sm">© 2025 SeungSik Hong. All rights reserved.</p>
            <p className="text-xs text-slate-500 mt-2">Built with Next.js 15, TypeScript & Tailwind CSS</p>
            <p className="text-xs text-slate-500 mt-1">🎯 Designed for immersive reading experience</p>
          </div>
        </div>
      </footer>
    </main>
  )
}