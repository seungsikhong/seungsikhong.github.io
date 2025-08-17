'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { getAllPostsMeta, getAllCategories, getAllTags, searchAndFilterPosts, formatDate, formatViews } from '@/utils/staticData'
import { Clock, Eye, ArrowRight, Search, Filter } from 'lucide-react'
import SearchBar from '@/components/SearchBar'
import FilterBar from '@/components/FilterBar'
import Pagination from '@/components/Pagination'
import PageHeader from '@/components/PageHeader'

export default function PostsPage() {
  const allPosts = getAllPostsMeta()
  const allCategories = getAllCategories()
  const allTags = getAllTags()

  // 검색 및 필터 상태
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 6

  // 필터링된 포스트
  const filteredPosts = useMemo(() => {
    return searchAndFilterPosts(searchQuery, selectedCategory, selectedTags)
  }, [searchQuery, selectedCategory, selectedTags])

  // 페이지네이션
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  )

  // 검색어나 필터 변경 시 첫 페이지로 이동
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
    setCurrentPage(1)
  }

  // 필터 초기화
  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedCategory(null)
    setSelectedTags([])
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* 헤더 */}
        <PageHeader
          title="모든 포스트"
          description="기술과 생각을 담은 모든 글들을 확인해보세요"
        />

        {/* 검색 및 필터링 */}
        <div className="mb-12 space-y-6">
          {/* 검색바 */}
          <SearchBar
            onSearch={handleSearch}
            onClear={() => handleSearch('')}
            placeholder="제목, 내용, 태그로 검색..."
            className="max-w-2xl mx-auto"
          />

          {/* 필터바 */}
          <FilterBar
            categories={allCategories}
            tags={allTags}
            selectedCategory={selectedCategory}
            selectedTags={selectedTags}
            onCategoryChange={handleCategoryChange}
            onTagToggle={handleTagToggle}
            onClearAll={clearAllFilters}
            className="max-w-4xl mx-auto"
          />

          {/* 검색 결과 정보 */}
          {(searchQuery || selectedCategory || selectedTags.length > 0) && (
            <div className="text-center">
              <p className="text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {filteredPosts.length}개
                </span>의 포스트를 찾았습니다
                {searchQuery && (
                  <span className="ml-2">
                    (검색어: <span className="font-semibold">"{searchQuery}"</span>)
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* 포스트 목록 */}
        <div className="grid gap-8 mb-12">
          {currentPosts.map((post) => (
            <article
              key={post.slug}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 overflow-hidden group"
            >
              <Link href={`/posts/${post.slug}`}>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {formatViews(post.views)}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {post.title}
                  </h2>

                  <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                      <span>{formatDate(post.date)}</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform duration-300">
                      <span className="text-sm font-medium">읽기</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* 태그 */}
                  {post.tags.length > 0 && (
                    <div className="flex items-center space-x-2 mt-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* 포스트가 없을 때 */}
        {currentPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold mb-4">아직 포스트가 없습니다</h3>
            <p className="text-slate-600 dark:text-slate-400">
              첫 번째 포스트를 작성해보세요!
            </p>
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
    </div>
  )
}
