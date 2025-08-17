import menuSettings from '@/config/menuSettings.json'
import { defaultMenuItems, customMenuItems, MenuItem } from './menuConfig'
import { 
  Home, FileText, User, FolderOpen, Mail, BookOpen, 
  Code, Heart, Star, Lightbulb, Database, Wrench, 
  GitBranch, Rocket, Globe, Settings, Zap, Target,
  Palette, Camera, Music, Gamepad2, Coffee, Gift
} from 'lucide-react'

export interface MenuSettings {
  activeMenus: string[]
  menuOrder: string[]
  menuDescriptions: Record<string, string>
  menuIcons?: Record<string, string>
}

// 아이콘 매핑 함수
function getIconComponent(iconName: string) {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Home, FileText, User, FolderOpen, Mail, BookOpen, 
    Code, Heart, Star, Lightbulb, Database, Wrench, 
    GitBranch, Rocket, Globe, Settings, Zap, Target,
    Palette, Camera, Music, Gamepad2, Coffee, Gift
  }
  return iconMap[iconName] || Code
}

// 활성화된 메뉴 목록 생성
export function getActiveMenus(): MenuItem[] {
  const allCustomMenus = [...defaultMenuItems, ...customMenuItems]
  const activeMenus: MenuItem[] = []
  
  // 설정된 순서대로 메뉴 추가
  menuSettings.menuOrder.forEach(menuId => {
    const menu = allCustomMenus.find(m => m.id === menuId)
    if (menu && (menuId === 'home' || menuId === 'posts' || menuSettings.activeMenus.includes(menuId))) {
      // 커스텀 아이콘이 있으면 적용
      if (menuSettings.menuIcons && menuSettings.menuIcons[menuId]) {
        const customIcon = getIconComponent(menuSettings.menuIcons[menuId])
        activeMenus.push({
          ...menu,
          icon: customIcon
        })
      } else {
        activeMenus.push(menu)
      }
    }
  })
  
  return activeMenus
}

// 특정 메뉴 정보 가져오기
export function getMenuInfo(menuId: string): MenuItem | null {
  const allMenus = [...defaultMenuItems, ...customMenuItems]
  return allMenus.find(menu => menu.id === menuId) || null
}

// 메뉴 설명 가져오기
export function getMenuDescription(menuId: string): string {
  return menuSettings.menuDescriptions[menuId] || ''
}

// 메뉴가 활성화되어 있는지 확인
export function isMenuActive(menuId: string): boolean {
  return menuId === 'home' || menuId === 'posts' || menuSettings.activeMenus.includes(menuId)
}
