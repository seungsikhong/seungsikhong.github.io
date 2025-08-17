// 읽기 진행도 바
'use client'

interface ReadingProgressProps {
  progress: number
}

export default function ReadingProgress({ progress }: ReadingProgressProps) {
  return (
    <div className="
      fixed top-0 left-0 right-0 z-50
      h-1 bg-gray-200/50 dark:bg-slate-700/50
    ">
      <div
        className="
          h-full bg-gradient-to-r from-blue-500 to-blue-600
          transition-all duration-300 ease-out
          shadow-sm
        "
        style={{ width: `${progress}%` }}
      />

      {/* 읽기 완료 표시 */}
      {progress >= 100 && (
        <div className="
          absolute right-4 top-2
          animate-bounce
        ">
          <div className="
            px-3 py-1 rounded-full text-xs font-medium
            bg-green-100 dark:bg-green-900/30
            text-green-700 dark:text-green-400
            border border-green-200 dark:border-green-700
          ">
            ✨ 완독!
          </div>
        </div>
      )}
    </div>
  )
}