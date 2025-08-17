import ReadingLayout from '@/components/ReadingLayout'

// 예시 목차 데이터
const sampleTOC = [
  { id: 'introduction', title: '소개', level: 1 },
  { id: 'getting-started', title: '시작하기', level: 1 },
  { id: 'basic-setup', title: '기본 설정', level: 2 },
  { id: 'advanced-config', title: '고급 설정', level: 2 },
  { id: 'deployment', title: '배포하기', level: 1 },
  { id: 'github-pages', title: 'GitHub Pages 설정', level: 2 },
  { id: 'custom-domain', title: '커스텀 도메인', level: 2 },
  { id: 'conclusion', title: '결론', level: 1 },
]

export default function SamplePostPage() {
  return (
    <ReadingLayout showSidebars={true} tableOfContents={sampleTOC}>
      <article className="prose prose-lg dark:prose-invert max-w-none">
        <header className="mb-12 text-center border-b border-gray-200 dark:border-slate-700 pb-8">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              Frontend
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-slate-100 leading-tight">
            Next.js 15로 Git Blog 만들기
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            GitHub Pages와 Next.js 15를 활용해서 정적 블로그를 만드는 완전한 가이드입니다.
            MDX를 사용한 글쓰기부터 자동 배포까지 모든 과정을 담았습니다.
          </p>

          <div className="flex items-center justify-center space-x-6 mt-8 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-2">
              <span>📅</span>
              <span>2024년 1월 15일</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>⏱️</span>
              <span>8분 읽기</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>👀</span>
              <span>1,234 조회</span>
            </div>
          </div>
        </header>

        <div className="prose-content space-y-8">
          <section id="introduction">
            <h2>소개</h2>

            <p>
              개발자로서 기술 블로그를 운영하는 것은 매우 중요합니다.
              자신이 학습한 내용을 정리하고, 다른 개발자들과 지식을 공유할 수 있는
              훌륭한 수단이기 때문입니다.
            </p>

            <p>
              이 글에서는 Next.js 15와 GitHub Pages를 활용하여
              완전히 정적인 블로그를 만드는 방법을 단계별로 설명합니다.
            </p>
          </section>

          <section id="getting-started">
            <h2>시작하기</h2>

            <p>
              먼저 Next.js 프로젝트를 생성하고 필요한 패키지들을 설치해보겠습니다.
            </p>

            <h3 id="basic-setup">기본 설정</h3>

            <p>다음 명령어로 새로운 Next.js 프로젝트를 생성합니다:</p>

            <pre><code>npx create-next-app@latest my-blog --typescript --tailwind --eslint --app</code></pre>

            <h3 id="advanced-config">고급 설정</h3>

            <p>Next.js 설정 파일을 수정하여 정적 사이트 생성을 활성화합니다.</p>
          </section>

          <section id="deployment">
            <h2>배포하기</h2>

            <p>이제 완성된 블로그를 GitHub Pages에 배포해보겠습니다.</p>

            <h3 id="github-pages">GitHub Pages 설정</h3>

            <p>GitHub Actions 워크플로우를 설정하여 자동 배포를 구현합니다.</p>

            <h3 id="custom-domain">커스텀 도메인</h3>

            <p>커스텀 도메인을 사용하고 싶다면 CNAME 파일에 도메인을 추가하면 됩니다.</p>
          </section>

          <section id="conclusion">
            <h2>결론</h2>

            <p>
              이렇게 Next.js 15와 GitHub Pages를 활용하여 완전한 정적 블로그를 만들어보았습니다.
            </p>

            <p>
              이제 여러분만의 멋진 기술 블로그를 운영해보세요!
            </p>
          </section>
        </div>
      </article>
    </ReadingLayout>
  )
}