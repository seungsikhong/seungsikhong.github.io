import type { CollectionEntry } from 'astro:content'
import { buildCategoryItems } from '../utils/taxonomy'

export type ShareChannel = 'copy' | 'x' | 'linkedin' | 'facebook' | 'email'

export type NavigationItem = {
  label: string
  href: string
  description?: string
  translationKey?: string
  icon?: 'writing' | 'topic'
}

export type NavigationGroup = {
  label: string
  translationKey?: string
  items: NavigationItem[]
}

type PostEntry = CollectionEntry<'posts'>

export const siteMeta = {
  title: 'SeungSik Hong',
  description: '프론트엔드와 인터페이스 구조를 중심으로 기록하는 개인 기술 블로그입니다.',
  url: 'https://seungsikhong.github.io',
  author: 'SeungSik Hong',
  locale: 'ko_KR',
  twitterCard: 'summary' as const,
  ogImage: '/og-default.png',
}

const staticNavigation: NavigationGroup[] = [
  {
    label: 'Menu',
    translationKey: 'nav_menu',
    items: [
      { label: 'Writing', href: '/posts/', translationKey: 'nav_writing', icon: 'writing' },
    ],
  },
]

export function buildNavigationGroups(posts: PostEntry[]) {
  const categoryItems = buildCategoryItems(posts).map((item) => ({
    label: item.label,
    href: item.href,
    description: `${item.count}`,
    icon: 'topic' as const,
  }))

  return categoryItems.length > 0
    ? [...staticNavigation, { label: 'Topics', translationKey: 'nav_topics', items: categoryItems }]
    : staticNavigation
}

export const commentConfig = {
  provider: 'giscus' as const,
  repo: '',
  repoId: '',
  category: 'Comments',
  categoryId: '',
  mapping: 'pathname',
  strict: '0',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'top',
  lang: 'ko',
  lightTheme: 'light',
  darkTheme: 'dark_dimmed',
}

export const analyticsConfig = {
  provider: 'goatcounter' as const,
  site: 'https://seungsikhong.goatcounter.com',
}

export const shareConfig = {
  copy: true,
  x: true,
  linkedin: true,
  facebook: true,
  email: true,
} as const satisfies Record<ShareChannel, boolean>

export function getEnabledShareChannels() {
  return Object.entries(shareConfig)
    .filter(([, enabled]) => enabled)
    .map(([channel]) => channel as ShareChannel)
}

export function hasCommentProviderConfig() {
  return Boolean(
    commentConfig.repo &&
      commentConfig.repoId &&
      commentConfig.category &&
      commentConfig.categoryId
  )
}

export function hasAnalyticsProviderConfig() {
  return Boolean(analyticsConfig.site)
}

export function getAnalyticsSiteBase() {
  if (!analyticsConfig.site) return ''
  return analyticsConfig.site.replace(/\/+$/, '')
}

export function getAnalyticsCountEndpoint() {
  const base = getAnalyticsSiteBase()
  return base ? `${base}/count` : ''
}

export function getAnalyticsCounterJson(path: string) {
  const base = getAnalyticsSiteBase()
  return base ? `${base}/counter/${encodeURIComponent(path)}.json` : ''
}
