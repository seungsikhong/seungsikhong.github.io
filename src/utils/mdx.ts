import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'src/content/posts')

export interface PostMeta {
  title: string
  excerpt: string
  date: string
  category: string
  tags: string[]
  readTime: string
  views: number
  slug: string
}

export interface Post extends PostMeta {
  content: string
}

// 빌드 타임에만 실행되는 함수들
export function getAllPostsMeta(): PostMeta[] {
  // 빌드 타임이 아닌 경우 빈 배열 반환
  if (typeof window !== 'undefined') {
    return []
  }

  try {
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map((fileName) => {
        const slug = fileName.replace(/\.mdx$/, '')
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data } = matter(fileContents)

        return {
          slug,
          title: data.title,
          excerpt: data.excerpt,
          date: data.date,
          category: data.category,
          tags: data.tags || [],
          readTime: data.readTime,
          views: data.views || 0,
        } as PostMeta
      })

    // 날짜순으로 정렬 (최신순)
    return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
  } catch (error) {
    console.error('Error reading posts directory:', error)
    return []
  }
}

// 특정 포스트의 전체 데이터 가져오기
export function getPostBySlug(slug: string): Post | null {
  // 빌드 타임이 아닌 경우 null 반환
  if (typeof window !== 'undefined') {
    return null
  }

  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      content,
      title: data.title,
      excerpt: data.excerpt,
      date: data.date,
      category: data.category,
      tags: data.tags || [],
      readTime: data.readTime,
      views: data.views || 0,
    } as Post
  } catch (error) {
    console.error(`Post not found: ${slug}`)
    return null
  }
}

// 카테고리별 포스트 가져오기
export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPostsMeta().filter(post => post.category === category)
}

// 태그별 포스트 가져오기
export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPostsMeta().filter(post => post.tags.includes(tag))
}

// 모든 카테고리 가져오기
export function getAllCategories(): string[] {
  const posts = getAllPostsMeta()
  const categories = posts.map(post => post.category)
  return [...new Set(categories)]
}

// 모든 태그 가져오기
export function getAllTags(): string[] {
  const posts = getAllPostsMeta()
  const tags = posts.flatMap(post => post.tags)
  return [...new Set(tags)]
}

// 정적 데이터 생성 (빌드 타임용)
export function generateStaticData() {
  const posts = getAllPostsMeta()
  const categories = getAllCategories()
  const tags = getAllTags()
  
  return {
    posts,
    categories,
    tags,
    postsByCategory: categories.reduce((acc, category) => {
      acc[category] = getPostsByCategory(category)
      return acc
    }, {} as Record<string, PostMeta[]>),
    postsByTag: tags.reduce((acc, tag) => {
      acc[tag] = getPostsByTag(tag)
      return acc
    }, {} as Record<string, PostMeta[]>)
  }
}
