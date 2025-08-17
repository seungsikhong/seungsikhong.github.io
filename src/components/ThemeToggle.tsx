// 테마 토글 버튼
'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="
        relative p-2 rounded-lg
        bg-gray-100 hover:bg-gray-200
        dark:bg-slate-800 dark:hover:bg-slate-700
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        dark:focus:ring-offset-slate-900
      "
      aria-label="테마 전환"
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon */}
        <Sun
          className={`
            absolute inset-0 w-5 h-5 text-yellow-500
            transition-all duration-300 ease-in-out
            ${theme === 'light'
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 rotate-90 scale-75'
            }
          `}
        />

        {/* Moon Icon */}
        <Moon
          className={`
            absolute inset-0 w-5 h-5 text-blue-400
            transition-all duration-300 ease-in-out
            ${theme === 'dark'
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-90 scale-75'
            }
          `}
        />
      </div>
    </button>
  )
}