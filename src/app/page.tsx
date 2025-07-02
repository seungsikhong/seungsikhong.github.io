export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">SeungSik Hong</h1>
          <p className="text-gray-600 mt-1">Developer Blog</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-5xl font-bold mb-6">
            👋
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Next.js, TypeScript, React
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="#about"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              소개 보기
            </a>
            <a
              href="#posts"
              className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              블로그 포스트
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold mb-8 text-center">About Me</h3>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h4 className="text-xl font-semibold mb-4">홍승식</h4>
              <p className="text-gray-600 mb-4">
                웹 개발자
              </p>
              <div className="flex flex-wrap gap-2">
                {['Next.js', 'TypeScript', 'React', 'Tailwind CSS', 'Node.js'].map((tech) => (
                  <span
                    key={tech}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h5 className="font-semibold mb-3">현재 작업 중인 프로젝트</h5>
              <ul className="space-y-2 text-gray-600">
                <li>• Git Blog 개발 (Next.js + MDX)</li>
                <li>• 웹 성능 최적화 연구</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section id="posts" className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold mb-8 text-center">Recent Posts</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Next.js로 Git Blog 만들기",
                excerpt: "GitHub Pages와 Next.js를 활용한 정적 블로그 구축기",
                date: "2024-01-15"
              },
            ].map((post, index) => (
              <article key={index} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                <h4 className="font-semibold mb-2">{post.title}</h4>
                <p className="text-gray-600 text-sm mb-3">{post.excerpt}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{post.date}</span>
                  <span className="text-blue-600 text-sm hover:underline cursor-pointer">
                    읽어보기 →
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2025 SeungSik Hong. All rights reserved.</p>
          <p className="text-gray-400 mt-2">Built with Next.js & Tailwind CSS</p>
        </div>
      </footer>
    </main>
  )
}