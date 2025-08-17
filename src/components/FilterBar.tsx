'use client'

import { useState } from 'react'
import { Filter, X, Tag, Folder } from 'lucide-react'

interface FilterBarProps {
  categories: string[]
  tags: string[]
  selectedCategory: string | null
  selectedTags: string[]
  onCategoryChange: (category: string | null) => void
  onTagToggle: (tag: string) => void
  onClearAll: () => void
  className?: string
}

export default function FilterBar({
  categories,
  tags,
  selectedCategory,
  selectedTags,
  onCategoryChange,
  onTagToggle,
  onClearAll,
  className = ""
}: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false)

  const hasActiveFilters = selectedCategory || selectedTags.length > 0

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 필터 토글 버튼 */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-lg
            transition-all duration-200
            ${showFilters
              ? 'bg-blue-500 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }
          `}
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">필터</span>
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
              {selectedTags.length + (selectedCategory ? 1 : 0)}
            </span>
          )}
        </button>

        {/* 필터 초기화 버튼 */}
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="
              flex items-center space-x-1 px-3 py-2
              text-slate-500 hover:text-slate-700
              dark:text-slate-400 dark:hover:text-slate-200
              transition-colors duration-200
            "
          >
            <X className="w-4 h-4" />
            <span className="text-sm">초기화</span>
          </button>
        )}
      </div>

      {/* 필터 패널 */}
      {showFilters && (
        <div className="
          p-4 bg-white dark:bg-slate-800
          border border-slate-200 dark:border-slate-700
          rounded-xl shadow-sm
          space-y-4
        ">
          {/* 카테고리 필터 */}
          <div>
            <h3 className="flex items-center space-x-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              <Folder className="w-4 h-4" />
              <span>카테고리</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onCategoryChange(null)}
                className={`
                  px-3 py-1.5 text-xs rounded-full transition-all duration-200
                  ${!selectedCategory
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }
                `}
              >
                전체
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  className={`
                    px-3 py-1.5 text-xs rounded-full transition-all duration-200
                    ${selectedCategory === category
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* 태그 필터 */}
          <div>
            <h3 className="flex items-center space-x-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              <Tag className="w-4 h-4" />
              <span>태그</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagToggle(tag)}
                  className={`
                    px-3 py-1.5 text-xs rounded-full transition-all duration-200
                    ${selectedTags.includes(tag)
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }
                  `}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
