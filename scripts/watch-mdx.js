#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

const postsDirectory = path.join(process.cwd(), 'src/content/posts')

console.log('👀 MDX 파일 변경 감지 중...')
console.log(`📁 감시 디렉토리: ${postsDirectory}`)

// build-data 실행 함수
function runBuildData() {
  console.log('🔄 정적 데이터 생성 중...')
  exec('npm run build-data', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ 빌드 실패:', error)
      return
    }
    console.log('✅ 정적 데이터 생성 완료!')
    console.log(stdout)
  })
}

// 파일 변경 감지
fs.watch(postsDirectory, { recursive: true }, (eventType, filename) => {
  if (filename && filename.endsWith('.mdx')) {
    console.log(`📝 파일 변경 감지: ${filename}`)
    runBuildData()
  }
})

// 초기 실행
runBuildData()

console.log('💡 Ctrl+C로 종료하세요.')
