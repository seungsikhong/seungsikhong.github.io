import { notFound } from 'next/navigation'
import ReadingLayout from '@/components/ReadingLayout'
import { getAllPostsMeta, getPostBySlug } from '@/utils/staticData'
import { formatDate } from '@/utils/staticData'
import PageHeader from '@/components/PageHeader'

// 정적 경로 생성
export async function generateStaticParams() {
  const posts = getAllPostsMeta()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// 메타데이터 생성
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: ['SeungSik Hong'],
      tags: post.tags,
    },
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // 첫 번째 h1 태그를 제거한 콘텐츠 생성
  const cleanContent = post.content
    .replace(/<h1[^>]*>.*?<\/h1>/, '')
    .trim()
    .replace(/^\s*[\r\n]/gm, '')
  
  // 목차 생성 (HTML에서 제목 추출, 첫 번째 h1 제외)
  const tableOfContents = cleanContent
    .match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/g)
    ?.map((match, index) => {
      const level = parseInt(match.match(/<h([1-6])/)?.[1] || '1')
      const title = match.replace(/<[^>]*>/g, '')
      const id = title.toLowerCase().replace(/[^a-z0-9가-힣]/g, '-')
      return { id, title, level }
    }) || []

  return (
    <ReadingLayout showSidebars={true} tableOfContents={tableOfContents}>
      {/* 브레드크럼 네비게이션 */}
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
              <span>{formatDate(post.date)}</span>
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

          {/* 태그 */}
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
          {/* HTML로 변환된 MDX 콘텐츠가 여기에 렌더링됩니다 */}
          <div 
            dangerouslySetInnerHTML={{ __html: cleanContent }} 
            className="prose prose-lg dark:prose-invert max-w-none"
          />
        </div>
      </article>
    </ReadingLayout>
  )
}
