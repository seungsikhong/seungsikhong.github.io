import ReadingLayout from '@/components/ReadingLayout'
import PageHeader from '@/components/PageHeader'

export default function AboutPage() {
  return (
    <ReadingLayout showSidebars={false}>
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* 헤더 */}
        <PageHeader
          title="About Me"
          description="개발자 홍승식에 대해 알아보세요"
        />

        {/* 프로필 섹션 */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">SH</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                홍승식 (SeungSik Hong)
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Full Stack Developer
              </p>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h3>안녕하세요! 👋</h3>
            <p>
              저는 사용자 경험을 중시하는 웹 개발자입니다. 
              새로운 기술을 배우는 것을 좋아하며, 
              깔끔하고 효율적인 코드를 작성하는 것을 목표로 합니다.
            </p>

            <h3>주요 기술 스택</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
              <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <h4 className="font-semibold mb-2">Frontend</h4>
                <ul className="text-sm space-y-1">
                  <li>• React 18</li>
                  <li>• Next.js 15</li>
                  <li>• TypeScript</li>
                  <li>• Tailwind CSS</li>
                </ul>
              </div>
              <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <h4 className="font-semibold mb-2">Backend</h4>
                <ul className="text-sm space-y-1">
                  <li>• Node.js</li>
                  <li>• Express.js</li>
                  <li>• PostgreSQL</li>
                  <li>• MongoDB</li>
                </ul>
              </div>
              <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <h4 className="font-semibold mb-2">Tools</h4>
                <ul className="text-sm space-y-1">
                  <li>• Git & GitHub</li>
                  <li>• Docker</li>
                  <li>• AWS</li>
                  <li>• Vercel</li>
                </ul>
              </div>
            </div>

            <h3>블로그 철학</h3>
            <p>
              이 블로그는 <strong>읽기에 집중할 수 있는 인터페이스</strong>를 목표로 설계되었습니다.
              기술적인 내용을 명확하고 이해하기 쉽게 전달하는 것을 중요하게 생각합니다.
            </p>

            <blockquote>
              "좋은 코드는 읽기 쉬운 코드다. 
              더 나아가서는 읽기 즐거운 코드여야 한다."
            </blockquote>

            <h3>연락처</h3>
            <p>
              궁금한 점이나 제안사항이 있으시면 언제든 연락해주세요!
            </p>
            <ul>
              <li>📧 Email: seungsik.hong@example.com</li>
              <li>🐙 GitHub: <a href="https://github.com/seungsikhong" className="text-blue-600 dark:text-blue-400">github.com/seungsikhong</a></li>
              <li>💼 LinkedIn: <a href="https://linkedin.com/in/seungsikhong" className="text-blue-600 dark:text-blue-400">linkedin.com/in/seungsikhong</a></li>
            </ul>
          </div>
        </div>
      </div>
    </ReadingLayout>
  )
}
