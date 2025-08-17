'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, Filter } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string) => void
  onClear: () => void
  placeholder?: string
  className?: string
}

export default function SearchBar({ 
  onSearch, 
  onClear, 
  placeholder = "포스트 검색...",
  className = ""
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // 검색어 변경 시 자동 검색 (디바운싱)
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query)
    }, 300) // 300ms 디바운싱

    return () => clearTimeout(timer)
  }, [query, onSearch])

  const handleClear = () => {
    setQuery('')
    onClear()
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear()
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className={`
        relative flex items-center
        bg-white dark:bg-slate-800
        border border-slate-200 dark:border-slate-700
        rounded-xl shadow-sm
        transition-all duration-200
        ${isFocused 
          ? 'ring-2 ring-blue-500 border-blue-500' 
          : 'hover:border-slate-300 dark:hover:border-slate-600'
        }
      `}>
        {/* 검색 아이콘 */}
        <div className="pl-4 pr-2">
          <Search className="w-5 h-5 text-slate-400" />
        </div>

        {/* 검색 입력 */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="
            flex-1 py-3 px-2
            bg-transparent
            text-slate-900 dark:text-slate-100
            placeholder-slate-500 dark:placeholder-slate-400
            focus:outline-none
            text-sm
          "
        />

        {/* 검색어 지우기 버튼 */}
        {query && (
          <button
            onClick={handleClear}
            className="
              p-2 mr-2
              text-slate-400 hover:text-slate-600
              dark:text-slate-500 dark:hover:text-slate-300
              transition-colors duration-200
              rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700
            "
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 검색 단축키 안내 */}
      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-slate-500 dark:text-slate-400">
          <span>ESC: 검색어 지우기</span>
        </div>
      )}
    </div>
  )
}
