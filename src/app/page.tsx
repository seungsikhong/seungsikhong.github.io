'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { getAllPostsMeta, getPostBySlug, getPostsByCategory } from '@/utils/staticData'
import { getMenuInfo, getMenuDescription } from '@/utils/menuLoader'
import { Clock, Eye, ArrowRight, FileText } from 'lucide-react'
import ReadingLayout from '@/components/ReadingLayout'
import SearchBar from '@/components/SearchBar'
import Pagination from '@/components/Pagination'
import PageHeader from '@/components/PageHeader'
import Link from 'next/link'
import LeftSidebar from '@/components/LeftSidebar'

export default function HomePage() {
  const searchParams = useSearchParams()
  const [currentView, setCurrentView] = useState('home')
  const [currentData, setCurrentData] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const postsPerPage = 6

  // 쿼리 파라미터 처리
  useEffect(() => {
    const menu = searchParams.get('menu')
    const category = searchParams.get('category')
    const post = searchParams.get('post')

    if (post) {
      const postData = getPostBySlug(post)
      if (postData) {
        setCurrentView('post')
        setCurrentData(postData)
        return
      }
    }

    if (menu) {
      const menuInfo = getMenuInfo(menu)
      if (menuInfo) {
        setCurrentView('menu')
        setCurrentData({ menuInfo, menuId: menu })
        return
      }
    }

    if (category) {
      const categoryPosts = getPostsByCategory(category)
      setCurrentView('category')
      setCurrentData({ category, categoryPosts })
      return
    }

    // 기본 홈 페이지
    setCurrentView('home')
    setCurrentData(null)
  }, [searchParams])

  // 홈 페이지 렌더링
  if (currentView === 'home') {
    const allPosts = getAllPostsMeta()
    const samplePosts = allPosts.slice(0, 3)
    const popularPosts = allPosts.slice(0, 6)

    return (
      <main className="min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        {/* 좌측 사이드바 */}
        <LeftSidebar 
          isVisible={sidebarVisible} 
          onVisibilityChange={setSidebarVisible} 
        />

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
                  <Link key={post.slug} href={`/?post=${post.slug}`}>
                    <article className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 overflow-hidden group">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                            {post.category}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {post.views >= 1000 ? `${(post.views / 1000).toFixed(1)}k` : post.views}
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
                            {new Date(post.date).toLocaleDateString('ko-KR', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
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
                <FileText className="w-6 h-6 text-green-500 mr-3" />
                <h3 className="text-2xl font-bold">인기 포스트</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {popularPosts.map((post) => (
                  <Link key={post.slug} href={`/?post=${post.slug}`}>
                    <article className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 overflow-hidden group">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full">
                            {post.category}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {post.views >= 1000 ? `${(post.views / 1000).toFixed(1)}k` : post.views}
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
                            {new Date(post.date).toLocaleDateString('ko-KR', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
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
              <Link
                href="/posts"
                className="group px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <span>모든 포스트 보기</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
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
      </main>
    )
  }

  // 메뉴 페이지 렌더링
  if (currentView === 'menu') {
    const { menuInfo, menuId } = currentData
    const allPosts = getAllPostsMeta()
    const menuPosts = allPosts.filter(post => post.category.toLowerCase() === menuId)
    const menuDescription = getMenuDescription(menuId)

    const searchedPosts = searchQuery.trim() 
      ? menuPosts.filter(post => 
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : menuPosts

    const totalPages = Math.ceil(searchedPosts.length / postsPerPage)
    const currentPosts = searchedPosts.slice(
      (currentPage - 1) * postsPerPage,
      currentPage * postsPerPage
    )

    const handleSearch = (query: string) => {
      setSearchQuery(query)
      setCurrentPage(1)
    }

    return (
      <ReadingLayout showSidebars={false}>
        <div className="max-w-6xl mx-auto px-4 py-16">
          <PageHeader
            title={menuInfo.label}
            description={menuDescription || menuInfo.description}
          />
          
          <div className="text-center mb-8">
            <div className="text-slate-500 dark:text-slate-400">
              총 {menuPosts.length}개의 포스트
            </div>
          </div>

          <div className="mb-12">
            <SearchBar
              onSearch={handleSearch}
              onClear={() => handleSearch('')}
              placeholder={`${menuInfo.label} 포스트 검색...`}
              className="max-w-2xl mx-auto"
            />
          </div>

          {searchQuery && (
            <div className="text-center mb-8">
              <p className="text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {searchedPosts.length}개
                </span>의 포스트를 찾았습니다
                <span className="ml-2">
                  (검색어: <span className="font-semibold">"{searchQuery}"</span>)
                </span>
              </p>
            </div>
          )}

          {currentPosts.length > 0 ? (
            <div className="grid gap-8 mb-12">
              {currentPosts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 overflow-hidden group"
                >
                  <Link href={`/?post=${post.slug}`}>
                    <div className="p-8">
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm rounded-full font-medium">
                          {post.category}
                        </span>
                        <div className="flex space-x-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                        {post.title}
                      </h2>

                      <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(post.date).toLocaleDateString('ko-KR')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.views.toLocaleString()}</span>
                          </div>
                          <span>{post.readTime}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                포스트를 찾을 수 없습니다
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {searchQuery ? '검색 조건을 변경해보세요.' : '이 메뉴에는 아직 포스트가 없습니다.'}
              </p>
              <Link
                href="/"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                <span>홈으로 돌아가기</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="mt-12"
            />
          )}
        </div>
      </ReadingLayout>
    )
  }

  // 카테고리 페이지 렌더링
  if (currentView === 'category') {
    const { category, categoryPosts } = currentData
    const categoryInfo = category.charAt(0).toUpperCase() + category.slice(1)

    const searchedPosts = searchQuery.trim() 
      ? categoryPosts.filter(post => 
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : categoryPosts

    const totalPages = Math.ceil(searchedPosts.length / postsPerPage)
    const currentPosts = searchedPosts.slice(
      (currentPage - 1) * postsPerPage,
      currentPage * postsPerPage
    )

    const handleSearch = (query: string) => {
      setSearchQuery(query)
      setCurrentPage(1)
    }

    return (
      <ReadingLayout showSidebars={false}>
        <div className="max-w-6xl mx-auto px-4 py-16">
          <PageHeader
            title={categoryInfo}
            description={`${categoryInfo} 관련 포스트들을 확인해보세요`}
          />
          
          <div className="text-center mb-8">
            <div className="text-slate-500 dark:text-slate-400">
              총 {categoryPosts.length}개의 포스트
            </div>
          </div>

          <div className="mb-12">
            <SearchBar
              onSearch={handleSearch}
              onClear={() => handleSearch('')}
              placeholder={`${categoryInfo} 포스트 검색...`}
              className="max-w-2xl mx-auto"
            />
          </div>

          {searchQuery && (
            <div className="text-center mb-8">
              <p className="text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {searchedPosts.length}개
                </span>의 포스트를 찾았습니다
                <span className="ml-2">
                  (검색어: <span className="font-semibold">"{searchQuery}"</span>)
                </span>
              </p>
            </div>
          )}

          {currentPosts.length > 0 ? (
            <div className="grid gap-8 mb-12">
              {currentPosts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 overflow-hidden group"
                >
                  <Link href={`/?post=${post.slug}`}>
                    <div className="p-8">
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm rounded-full font-medium">
                          {post.category}
                        </span>
                        <div className="flex space-x-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                        {post.title}
                      </h2>

                      <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(post.date).toLocaleDateString('ko-KR')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.views.toLocaleString()}</span>
                          </div>
                          <span>{post.readTime}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                포스트를 찾을 수 없습니다
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {searchQuery ? '검색 조건을 변경해보세요.' : '이 카테고리에는 아직 포스트가 없습니다.'}
              </p>
              <Link
                href="/"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                <span>홈으로 돌아가기</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="mt-12"
            />
          )}
        </div>
      </ReadingLayout>
    )
  }

  // 포스트 페이지 렌더링
  if (currentView === 'post') {
    const post = currentData
    const tableOfContents = post.content
      .match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/g)
      ?.map((match, index) => {
        const level = parseInt(match.match(/<h([1-6])/)?.[1] || '1')
        const title = match.replace(/<[^>]*>/g, '')
        const id = title.toLowerCase().replace(/[^a-z0-9가-힣]/g, '-')
        return { id, title, level }
      }) || []

    return (
      <ReadingLayout showSidebars={true} tableOfContents={tableOfContents}>
        <div className="mb-8">
          <PageHeader
            title={post.title}
            description={post.excerpt}
            showBreadcrumb={true}
            showBackButton={true}
          />
        </div>

        <article className="prose prose-lg dark:prose-invert max-w-none">
          <header className="mb-12 text-center border-b border-gray-200 dark:border-slate-700 pb-8">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                {post.category}
              </span>
            </div>

            <div className="flex items-center justify-center space-x-6 mt-8 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center space-x-2">
                <span>📅</span>
                <span>{new Date(post.date).toLocaleDateString('ko-KR')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>⏱️</span>
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>👀</span>
                <span>{post.views.toLocaleString()} 조회</span>
              </div>
            </div>

            {post.tags.length > 0 && (
              <div className="flex items-center justify-center space-x-2 mt-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="prose-content">
            <div dangerouslySetInnerHTML={{ __html: post.content }} className="prose prose-lg dark:prose-invert max-w-none" />
          </div>
        </article>
      </ReadingLayout>
    )
  }

  return null
}