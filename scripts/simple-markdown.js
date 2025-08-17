#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const postsDirectory = path.join(process.cwd(), 'src/content/posts')
const outputFile = path.join(process.cwd(), 'src/data/posts.json')

// 간단한 마크다운 → HTML 변환 함수
function markdownToHtml(markdown) {
  let html = markdown
    // 제목
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    
    // 굵은 글씨
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    
    // 기울임 글씨
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // 코드 블록
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    
    // 인라인 코드
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    
    // 링크
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    
    // 인용문
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    
    // 리스트
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/^(\d+)\. (.*$)/gim, '<li>$2</li>')
    
    // 테이블 (간단한 버전)
    .replace(/\|(.+)\|/g, function(match) {
      const cells = match.split('|').slice(1, -1)
      return '<tr>' + cells.map(cell => `<td>${cell.trim()}</td>`).join('') + '</tr>'
    })
    
    // 줄바꿈
    .replace(/\n/g, '<br>')
  
  // 첫 번째 h1 태그 제거 (중복 제목 방지)
  html = html.replace(/<h1[^>]*>.*?<\/h1>/, '')
  
  // 앞뒤 공백 제거
  html = html.trim()
  
  // 빈 줄 제거
  html = html.replace(/^\s*[\r\n]/gm, '')
  
  return html
}

// MDX 파일들을 읽어서 정적 데이터 생성
function generateStaticData() {
  try {
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map((fileName) => {
        const slug = fileName.replace(/\.mdx$/, '')
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)

        // MDX 콘텐츠를 HTML로 변환
        const htmlContent = markdownToHtml(content)

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
