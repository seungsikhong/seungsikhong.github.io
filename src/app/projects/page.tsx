import ReadingLayout from '@/components/ReadingLayout'
import { ExternalLink, Github, Globe } from 'lucide-react'
import PageHeader from '@/components/PageHeader'

export default function ProjectsPage() {
  const projects = [
    {
      id: 1,
      title: "개발자 블로그",
      description: "Next.js 15와 TypeScript로 구축한 정적 블로그. MDX 기반 콘텐츠 시스템과 완전한 반응형 디자인을 구현했습니다.",
      technologies: ["Next.js 15", "TypeScript", "Tailwind CSS", "MDX"],
      image: "/api/placeholder/400/250",
      githubUrl: "https://github.com/seungsikhong/seungsikhong.github.io",
      liveUrl: "https://seungsikhong.github.io",
      featured: true
    },
    {
      id: 2,
      title: "E-Commerce Platform",
      description: "React와 Node.js로 구축한 풀스택 이커머스 플랫폼. 결제 시스템과 관리자 대시보드를 포함합니다.",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
      image: "/api/placeholder/400/250",
      githubUrl: "https://github.com/seungsikhong/ecommerce-platform",
      liveUrl: "https://ecommerce-demo.example.com",
      featured: true
    },
    {
      id: 3,
      title: "Task Management App",
      description: "실시간 협업이 가능한 태스크 관리 애플리케이션. WebSocket을 활용한 실시간 업데이트 기능을 구현했습니다.",
      technologies: ["React", "Socket.io", "MongoDB", "Express"],
      image: "/api/placeholder/400/250",
      githubUrl: "https://github.com/seungsikhong/task-manager",
      liveUrl: "https://task-manager-demo.example.com",
      featured: false
    },
    {
      id: 4,
      title: "Weather Dashboard",
      description: "OpenWeatherMap API를 활용한 날씨 대시보드. 위치 기반 날씨 정보와 7일 예보를 제공합니다.",
      technologies: ["React", "TypeScript", "OpenWeatherMap API", "Chart.js"],
      image: "/api/placeholder/400/250",
      githubUrl: "https://github.com/seungsikhong/weather-dashboard",
      liveUrl: "https://weather-demo.example.com",
      featured: false
    }
  ]

  return (
    <ReadingLayout showSidebars={false}>
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* 헤더 */}
        <PageHeader
          title="Projects"
          description="제가 작업한 프로젝트들을 소개합니다"
        />

        {/* 프로젝트 그리드 */}
        <div className="grid gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`
                bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden
                transition-all duration-300 hover:shadow-xl
                ${project.featured ? 'ring-2 ring-blue-500' : ''}
              `}
            >
              <div className="md:flex">
                {/* 프로젝트 이미지 */}
                <div className="md:w-1/3">
                  <div className="h-48 md:h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                    <span className="text-slate-500 dark:text-slate-400 text-lg">
                      {project.title}
                    </span>
                  </div>
                </div>

                {/* 프로젝트 정보 */}
                <div className="md:w-2/3 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      {project.title}
                    </h3>
                    {project.featured && (
                      <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* 기술 스택 */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* 링크 */}
                  <div className="flex items-center space-x-4">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors duration-200"
                    >
                      <Github className="w-4 h-4" />
                      <span className="text-sm font-medium">GitHub</span>
                    </a>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    >
                      <Globe className="w-4 h-4" />
                      <span className="text-sm font-medium">Live Demo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 추가 정보 */}
        <div className="mt-16 text-center">
          <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              더 많은 프로젝트를 보고 싶으신가요?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              GitHub에서 더 많은 프로젝트와 오픈소스 기여를 확인할 수 있습니다.
            </p>
            <a
              href="https://github.com/seungsikhong"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors duration-200"
            >
                                  <Github className="w-5 h-5" />
              <span className="font-medium">GitHub 방문하기</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </ReadingLayout>
  )
}
