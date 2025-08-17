'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronRight, ArrowLeft } from 'lucide-react'
import { getMenuInfo } from '@/utils/menuLoader'

/**
 * 브레드크럼 컴포넌트
 * 
 * 현재 페이지의 위치를 보여주는 네비게이션 경로입니다.
 * 예시: 홈 > 모든 포스트 > 포스트 제목
 * 
 * 기능:
 * - 자동으로 현재 경로를 분석하여 브레드크럼 생성
 * - 뒤로가기 버튼 제공
 * - 각 경로 단계를 클릭 가능한 링크로 제공
 */

interface BreadcrumbItem {
  label: string
  href: string
  isCurrent?: boolean
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  showBackButton?: boolean
  className?: string
}

export default function Breadcrumb({ 
  items, 
  showBackButton = true,
  className = "" 
}: BreadcrumbProps) {
  const pathname = usePathname()
  const router = useRouter()
  
  // 자동으로 브레드크럼 생성
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      { label: '홈', href: '/' }
    ]

    const pathSegments = pathname.split('/').filter(Boolean)
    
    let currentPath = ''
    let skipNext = false
    
    pathSegments.forEach((segment, index) => {
      if (skipNext) {
        skipNext = false
        return
      }
      
      currentPath += `/${segment}`
      
      // 메뉴 페이지인 경우
      if (segment === 'menu' && pathSegments[index + 1]) {
        const menuId = pathSegments[index + 1]
        const menuInfo = getMenuInfo(menuId)
        if (menuInfo) {
          breadcrumbs.push({
            label: menuInfo.label,
            href: currentPath,
            isCurrent: index === pathSegments.length - 2
          })
        }
        skipNext = true
        return
      }
      
      // 카테고리 페이지인 경우
      if (segment === 'category' && pathSegments[index + 1]) {
        const category = pathSegments[index + 1]
        breadcrumbs.push({
          label: category.charAt(0).toUpperCase() + category.slice(1),
          href: currentPath,
          isCurrent: index === pathSegments.length - 2
        })
        skipNext = true
        return
      }
      
      // 포스트 페이지인 경우
      if (segment === 'posts' && pathSegments[index + 1]) {
        breadcrumbs.push({
          label: pathSegments[index + 1].replace(/-/g, ' '),
          href: currentPath,
          isCurrent: true
        })
        skipNext = true
        return
      }
      
      // 기타 페이지들
      if (segment !== 'menu' && segment !== 'category' && segment !== 'posts') {
        const label = segment.charAt(0).toUpperCase() + segment.slice(1)
        breadcrumbs.push({
          label,
          href: currentPath,
          isCurrent: index === pathSegments.length - 1
        })
      }
    })

    return breadcrumbs
  }

  const breadcrumbItems = items || generateBreadcrumbs()

  // 뒤로가기 경로 결정
  const getBackPath = () => {
    if (pathname.startsWith('/posts/')) {
      return '/posts'
    } else if (pathname.startsWith('/menu/')) {
      return '/'
    } else if (pathname.startsWith('/category/')) {
      return '/'
    } else if (pathname === '/posts') {
      return '/'
    } else {
      return '/'
    }
  }

  return (
    <nav className={`flex items-center space-x-2 text-sm select-none ${className}`}>
      {/* 뒤로가기 버튼 */}
      {showBackButton && pathname !== '/' && (
        <button
          onClick={() => {
            // 브라우저 히스토리가 있으면 뒤로가기, 없으면 적절한 경로로
            if (window.history.length > 1) {
              window.history.back()
            } else {
              router.push(getBackPath())
            }
          }}
          className="
            flex items-center space-x-1 px-3 py-1.5
            text-slate-600 dark:text-slate-400
            hover:text-slate-900 dark:hover:text-slate-100
            transition-colors duration-200
            rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800
            cursor-pointer
          "
        >
          <ArrowLeft className="w-4 h-4" />
          <span>뒤로</span>
        </button>
      )}

      {/* 브레드크럼 */}
      <div className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => (
          <div key={`${item.href}-${index}`} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-slate-400 mx-2" />
            )}
            
            {item.isCurrent ? (
              <span className="
                text-slate-900 dark:text-slate-100 font-medium
                truncate max-w-xs
              ">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="
                  text-slate-600 dark:text-slate-400
                  hover:text-slate-900 dark:hover:text-slate-100
                  transition-colors duration-200
                  truncate max-w-xs
                "
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </div>
    </nav>
  )
}
