#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

// 동적 import를 사용하여 ES 모듈 불러오기
let remark, remarkHtml, remarkGfm

async function loadRemarkModules() {
  if (!remark) {
    const remarkModule = await import('remark')
    const remarkHtmlModule = await import('remark-html')
    const remarkGfmModule = await import('remark-gfm')
    
    remark = remarkModule.remark
    remarkHtml = remarkHtmlModule.default
    remarkGfm = remarkGfmModule.default
  }
}

const postsDirectory = path.join(process.cwd(), 'src/content/posts')
const outputFile = path.join(process.cwd(), 'src/data/posts.json')

// MDX를 HTML로 변환하는 함수
async function markdownToHtml(markdown) {
  try {
    // remark 모듈들을 동적으로 로드
    await loadRemarkModules()
    
    const result = await remark()
      .use(remarkGfm)  // GitHub Flavored Markdown 지원
      .use(remarkHtml) // HTML로 변환
      .process(markdown)
    
    return String(result)
  } catch (error) {
    console.error('Markdown 변환 오류:', error)
    return markdown // 변환 실패 시 원본 반환
  }
}

// MDX 파일들을 읽어서 정적 데이터 생성
async function generateStaticData() {
  try {
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = await Promise.all(
      fileNames
        .filter((fileName) => fileName.endsWith('.mdx'))
        .map(async (fileName) => {
          const slug = fileName.replace(/\.mdx$/, '')
          const fullPath = path.join(postsDirectory, fileName)
          const fileContents = fs.readFileSync(fullPath, 'utf8')
          const { data, content } = matter(fileContents)

          // MDX 콘텐츠를 HTML로 변환
          const htmlContent = await markdownToHtml(content)

          return {
            slug,
            title: data.title,
            excerpt: data.excerpt,
            date: data.date,
            category: data.category,
            tags: data.tags || [],
            readTime: data.readTime,
            views: data.views || 0,
            content: htmlContent, // HTML로 변환된 콘텐츠
          }
        })
    )

    // 날짜순으로 정렬 (최신순)
    const posts = allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))

    // 카테고리별 포스트
    const categories = [...new Set(posts.map(post => post.category))]
    const postsByCategory = categories.reduce((acc, category) => {
      acc[category] = posts.filter(post => post.category === category)
      return acc
    }, {})

    // 태그별 포스트
    const tags = [...new Set(posts.flatMap(post => post.tags))]
    const postsByTag = tags.reduce((acc, tag) => {
      acc[tag] = posts.filter(post => post.tags.includes(tag))
      return acc
    }, {})

    const staticData = {
      posts,
      categories,
      tags,
      postsByCategory,
      postsByTag
    }

    // JSON 파일로 저장
    fs.writeFileSync(outputFile, JSON.stringify(staticData, null, 2))
    
    console.log(`✅ 정적 데이터 생성 완료: ${outputFile}`)
    console.log(`📊 총 ${posts.length}개의 포스트 처리됨`)
    console.log(`🏷️ 카테고리: ${categories.join(', ')}`)
    console.log(`🏷️ 태그: ${tags.join(', ')}`)
    
  } catch (error) {
    console.error('❌ 정적 데이터 생성 실패:', error)
    process.exit(1)
  }
}

// 스크립트 실행
if (require.main === module) {
  generateStaticData()
}

module.exports = { generateStaticData }
