// 헤더 컴포넌트
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="
      fixed top-0 left-0 right-0 z-50 h-16
      bg-white/80 dark:bg-slate-900/80
      backdrop-blur-md border-b border-gray-200 dark:border-slate-700
      transition-colors duration-300
    ">
      <div className="max-w-8xl mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          {/* 로고 영역 */}
          <div className="flex items-center space-x-3">
            <div className="
              w-8 h-8 rounded-lg
              bg-gradient-to-br from-primary-500 to-primary-600
              flex items-center justify-center
            ">
              <span className="text-white font-bold text-sm">SH</span>
            </div>
            <div>
              <h1 className="
                text-xl font-bold
                text-slate-900 dark:text-slate-100
                transition-colors duration-300
              ">
                SeungSik Hong
              </h1>
              <p className="
                text-xs text-slate-500 dark:text-slate-400
                transition-colors duration-300
              ">
                Developer Blog
              </p>
            </div>
          </div>

          {/* 네비게이션 영역 - 데스크톱용 */}
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="#about"
              className="
                text-slate-600 hover:text-slate-900
                dark:text-slate-300 dark:hover:text-slate-100
                transition-colors duration-200 font-medium
              "
            >
              About
            </a>
            <a
              href="#posts"
              className="
                text-slate-600 hover:text-slate-900
                dark:text-slate-300 dark:hover:text-slate-100
                transition-colors duration-200 font-medium
              "
            >
              Posts
            </a>
            <a
              href="#contact"
              className="
                text-slate-600 hover:text-slate-900
                dark:text-slate-300 dark:hover:text-slate-100
                transition-colors duration-200 font-medium
              "
            >
              Contact
            </a>
          </nav>

          {/* 테마 토글 */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}