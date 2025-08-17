'use client'

import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'
import Breadcrumb from './Breadcrumb'

interface PageHeaderProps {
  title: string
  description?: string
  showBreadcrumb?: boolean
  showBackButton?: boolean
  backUrl?: string
  className?: string
}

export default function PageHeader({
  title,
  description,
  showBreadcrumb = true,
  showBackButton = true,
  backUrl,
  className = ""
}: PageHeaderProps) {
  return (
    <div className={`mb-8 ${className}`}>
      {/* 브레드크럼 */}
      {showBreadcrumb && (
        <div className="mb-6">
          <Breadcrumb showBackButton={showBackButton} />
        </div>
      )}

      {/* 뒤로가기 버튼 (브레드크럼이 비활성화된 경우) */}
      {!showBreadcrumb && showBackButton && (
        <div className="mb-6">
          <Link
            href={backUrl || "javascript:history.back()"}
            className="
              inline-flex items-center space-x-2 px-4 py-2
              text-slate-600 dark:text-slate-400
              hover:text-slate-900 dark:hover:text-slate-100
              transition-colors duration-200
              rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800
            "
          >
            <ArrowLeft className="w-4 h-4" />
            <span>뒤로가기</span>
          </Link>
        </div>
      )}

      {/* 페이지 제목 */}
      <div className="text-center">
        <h1 className="
          text-3xl md:text-4xl font-bold
          text-slate-900 dark:text-slate-100
          mb-4
        ">
          {title}
        </h1>
        
        {description && (
          <p className="
            text-lg text-slate-600 dark:text-slate-400
            max-w-2xl mx-auto
          ">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
