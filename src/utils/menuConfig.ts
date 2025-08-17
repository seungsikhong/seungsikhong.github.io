import { Home, FileText, User, FolderOpen, Mail, BookOpen, Code, Heart, Star, Lightbulb } from 'lucide-react'

export interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  description?: string
  isExternal?: boolean
}

export interface CategoryMenu {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  description: string
  postCount: number
}

// 기본 메뉴 구성 (필수 메뉴)
export const defaultMenuItems: MenuItem[] = [
  {
    id: 'home',
    label: '홈',
    icon: Home,
    href: '/',
    description: '메인 페이지'
  },
  {
    id: 'posts',
    label: '모든 포스트',
    icon: FileText,
    href: '/posts',
    description: '전체 포스트 목록'
  }
]

// 커스텀 메뉴 구성 (사용자가 추가할 수 있는 메뉴)
export const customMenuItems: MenuItem[] = [
  {
    id: 'tutorial',
    label: '튜토리얼',
    icon: BookOpen,
    href: '/menu/tutorial',
    description: '단계별 학습 가이드'
  },
  {
    id: 'tips',
    label: '팁 & 트릭',
    icon: Lightbulb,
    href: '/menu/tips',
    description: '유용한 개발 팁'
  },
  {
    id: 'review',
    label: '리뷰',
    icon: Star,
    href: '/menu/review',
    description: '도구 및 서비스 리뷰'
  },
  {
    id: 'project',
    label: '프로젝트',
    icon: Code,
    href: '/menu/project',
    description: '개인 프로젝트'
  },
  {
    id: 'study',
    label: '스터디',
    icon: BookOpen,
    href: '/menu/study',
    description: '학습 노트'
  }
]

// 카테고리별 메뉴 생성 함수
export function generateCategoryMenus(categories: string[], postCounts: Record<string, number>): CategoryMenu[] {
  const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    'Frontend': Code,
    'Backend': Code,
    'DevOps': Code,
    'Database': Code,
    'Tools': Code,
    'Insights': Heart,
    'Tutorial': BookOpen,
    'Review': Star,
    'Test': Code
  }

  return categories.map(category => ({
    id: category.toLowerCase(),
    label: category,
    icon: categoryIcons[category] || FileText,
    href: `/category/${category.toLowerCase()}`,
    description: `${category} 관련 포스트`,
    postCount: postCounts[category] || 0
  }))
}

// 메뉴 구성 커스터마이징 함수
export function customizeMenu(
  baseMenu: MenuItem[],
  customItems: MenuItem[] = [],
  removeItems: string[] = []
): MenuItem[] {
  let menu = [...baseMenu]
  
  // 제거할 아이템들 삭제
  menu = menu.filter(item => !removeItems.includes(item.id))
  
  // 커스텀 아이템들 추가
  menu = [...menu, ...customItems]
  
  return menu
}
