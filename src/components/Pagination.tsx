'use client'

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = ""
}: PaginationProps) {
  if (totalPages <= 1) return null

  // 페이지 번호 생성 로직
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 7

    if (totalPages <= maxVisible) {
      // 전체 페이지가 적으면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // 첫 페이지
      pages.push(1)

      if (currentPage <= 4) {
        // 현재 페이지가 앞쪽에 있을 때
        for (let i = 2; i <= 5; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 3) {
        // 현재 페이지가 뒤쪽에 있을 때
        pages.push('...')
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // 현재 페이지가 중간에 있을 때
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      {/* 이전 페이지 버튼 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="
          flex items-center justify-center w-10 h-10
          border border-slate-200 dark:border-slate-700
          rounded-lg
          text-slate-600 dark:text-slate-400
          hover:bg-slate-50 dark:hover:bg-slate-700
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
        "
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* 페이지 번호들 */}
      {pageNumbers.map((page, index) => (
        <div key={index}>
          {page === '...' ? (
            <div className="flex items-center justify-center w-10 h-10">
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </div>
          ) : (
            <button
              onClick={() => onPageChange(page as number)}
              className={`
                flex items-center justify-center w-10 h-10
                border rounded-lg font-medium
                transition-all duration-200
                ${currentPage === page
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                }
              `}
            >
              {page}
            </button>
          )}
        </div>
      ))}

      {/* 다음 페이지 버튼 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="
          flex items-center justify-center w-10 h-10
          border border-slate-200 dark:border-slate-700
          rounded-lg
          text-slate-600 dark:text-slate-400
          hover:bg-slate-50 dark:hover:bg-slate-700
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
        "
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
