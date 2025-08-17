import postsData from '@/data/posts.json'
import { PostMeta, Post } from './mdx'

// 정적 데이터에서 포스트 메타데이터 가져오기
export function getAllPostsMeta(): PostMeta[] {
  return postsData.posts
}

// 특정 포스트 데이터 가져오기 (HTML 콘텐츠 포함)
export function getPostBySlug(slug: string): Post | null {
  const post = postsData.posts.find(post => post.slug === slug)
  if (!post) return null
  
  return {
    ...post,
    content: post.content || '' // HTML로 변환된 콘텐츠
  } as Post
}

// 카테고리별 포스트 가져오기
export function getPostsByCategory(category: string): PostMeta[] {
  return postsData.postsByCategory[category] || []
}

// 태그별 포스트 가져오기
export function getPostsByTag(tag: string): PostMeta[] {
  return postsData.postsByTag[tag] || []
}

// 모든 카테고리 가져오기
export function getAllCategories(): string[] {
  return postsData.categories
}

// 모든 태그 가져오기
export function getAllTags(): string[] {
  return postsData.tags
}

// 검색 기능
export function searchPosts(query: string): PostMeta[] {
  if (!query.trim()) return postsData.posts
  
  const lowercaseQuery = query.toLowerCase()
  return postsData.posts.filter(post => 
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.excerpt.toLowerCase().includes(lowercaseQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

// 필터링 기능
export function filterPosts(
  posts: PostMeta[],
  category: string | null = null,
  tags: string[] = []
): PostMeta[] {
  let filteredPosts = posts

  // 카테고리 필터링
  if (category) {
    filteredPosts = filteredPosts.filter(post => post.category === category)
  }

  // 태그 필터링
  if (tags.length > 0) {
    filteredPosts = filteredPosts.filter(post => 
      tags.some(tag => post.tags.includes(tag))
    )
  }

  return filteredPosts
}

// 검색 + 필터링 통합 함수
export function searchAndFilterPosts(
  query: string,
  category: string | null = null,
  tags: string[] = []
): PostMeta[] {
  const searchedPosts = searchPosts(query)
  return filterPosts(searchedPosts, category, tags)
}

// 날짜 포맷팅 (간단한 버전)
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  } catch {
    return dateString
  }
}

// 조회수 포맷팅
export function formatViews(views: number): string {
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}k`
  }
  return views.toString()
}
