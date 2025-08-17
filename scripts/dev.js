#!/usr/bin/env node

const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 개발 서버 시작 중...')

// MDX 파일 변경 감지 및 빌드
function startMdxWatcher() {
  const postsDirectory = path.join(process.cwd(), 'src/content/posts')
  
  console.log(`👀 MDX 파일 감시 중: ${postsDirectory}`)
  
  fs.watch(postsDirectory, { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith('.mdx')) {
      console.log(`📝 MDX 파일 변경 감지: ${filename}`)
      
      // build-data 실행
      const buildProcess = spawn('npm', ['run', 'build-data'], {
        stdio: 'inherit',
        shell: true
      })
      
      buildProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ 정적 데이터 업데이트 완료!')
        } else {
          console.error('❌ 정적 데이터 업데이트 실패!')
        }
      })
    }
  })
}

// Next.js 개발 서버 시작
function startNextDev() {
  console.log('🌐 Next.js 개발 서버 시작 중...')
  
  const nextProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true
  })
  
  nextProcess.on('close', (code) => {
    console.log(`Next.js 서버 종료 (코드: ${code})`)
    process.exit(code)
  })
}

// 초기 빌드
console.log('🔨 초기 정적 데이터 생성 중...')
const initialBuild = spawn('npm', ['run', 'build-data'], {
  stdio: 'inherit',
  shell: true
})

initialBuild.on('close', (code) => {
  if (code === 0) {
    console.log('✅ 초기 빌드 완료!')
    
    // MDX 감시 시작
    startMdxWatcher()
    
    // Next.js 서버 시작
    startNextDev()
  } else {
    console.error('❌ 초기 빌드 실패!')
    process.exit(code)
  }
})

// Ctrl+C 처리
process.on('SIGINT', () => {
  console.log('\n👋 개발 서버 종료 중...')
  process.exit(0)
})
