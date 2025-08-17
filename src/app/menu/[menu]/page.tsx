'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getAllPostsMeta, formatDate, formatViews } from '@/utils/staticData'
import { getMenuInfo, getMenuDescription } from '@/utils/menuLoader'
import { Clock, Eye, ArrowRight, FileText } from 'lucide-react'
import ReadingLayout from '@/components/ReadingLayout'
import SearchBar from '@/components/SearchBar'
import Pagination from '@/components/Pagination'
import PageHeader from '@/components/PageHeader'

export default function MenuPage() {
  const params = useParams()
  const menuId = params.menu as string
  
  const allPosts = getAllPostsMeta()
  const menuInfo = getMenuInfo(menuId)
  const menuDescription = getMenuDescription(menuId)
  
  // 해당 메뉴의 포스트들 (메뉴 ID와 카테고리가 일치하는 포스트)
  const menuPosts = useMemo(() => {
    return allPosts.filter(post => post.category.toLowerCase() === menuId)
  }, [allPosts, menuId])
  
  // 검색 상태
  const [searchQuery, setSearchQuery] = useState('')
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 6

  // 검색된 포스트
  const searchedPosts = useMemo(() => {
    if (!searchQuery.trim()) return menuPosts
    
    const lowercaseQuery = searchQuery.toLowerCase()
    return menuPosts.filter(post => 
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.excerpt.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  }, [menuPosts, searchQuery])

  // 페이지네이션
  const totalPages = Math.ceil(searchedPosts.length / postsPerPage)
  const currentPosts = searchedPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  )

  // 검색어 변경 시 첫 페이지로 이동
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  // 메뉴가 존재하지 않는 경우
  if (!menuInfo) {
    return (
      <ReadingLayout showSidebars={false}>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            메뉴를 찾을 수 없습니다
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            요청하신 메뉴가 존재하지 않습니다.
          </p>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            <span>홈으로 돌아가기</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </ReadingLayout>
    )
  }

  return (
    <ReadingLayout showSidebars={false}>
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* 헤더 */}
        <PageHeader
          title={menuInfo.label}
          description={menuDescription || menuInfo.description}
        />
        
        {/* 포스트 수 표시 */}
        <div className="text-center mb-8">
          <div className="text-slate-500 dark:text-slate-400">
            총 {menuPosts.length}개의 포스트
          </div>
        </div>

        {/* 검색바 */}
        <div className="mb-12">
          <SearchBar
            onSearch={handleSearch}
            onClear={() => handleSearch('')}
            placeholder={`${menuInfo.label} 포스트 검색...`}
            className="max-w-2xl mx-auto"
          />
        </div>

        {/* 검색 결과 정보 */}
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

        {/* 포스트 목록 */}
        {currentPosts.length > 0 ? (
          <div className="grid gap-8 mb-12">
            {currentPosts.map((post) => (
              <article
                key={post.slug}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 overflow-hidden group"
              >
                <Link href={`/posts/${post.slug}`}>
                  <div className="p-8">
                    {/* 카테고리 및 태그 */}
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

                    {/* 제목 */}
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {post.title}
                    </h2>

                    {/* 요약 */}
                    <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                      {post.excerpt}
                    </p>

                    {/* 메타 정보 */}
                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(post.date)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{formatViews(post.views)}</span>
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
              href="/posts"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              <span>모든 포스트 보기</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* 페이지네이션 */}
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
