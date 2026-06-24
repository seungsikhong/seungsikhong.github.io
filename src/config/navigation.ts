import type { CollectionEntry } from 'astro:content'
import { buildCategoryItems } from '../utils/taxonomy'

export type NavigationIcon = 'writing' | 'topic' | 'about'

export type NavigationItem = {
  label: string
  href: string
  description?: string
  translationKey?: string
  icon?: NavigationIcon
}

export type NavigationGroup = {
  label: string
  translationKey?: string
  items: NavigationItem[]
}

export type NavigationConfig = {
  groups: NavigationGroup[]
  topics: {
    enabled: boolean
    label: string
    translationKey?: string
    showCounts: boolean
  }
}

type PostEntry = CollectionEntry<'posts'>

// Edit navigation here. Fixed links and the auto-generated topics group are managed together.
export const navigationConfig = {
  groups: [
    {
      label: '메뉴',
      translationKey: 'nav_menu',
      items: [
        { label: '글', href: '/posts/', translationKey: 'nav_writing', icon: 'writing' },
        { label: '소개', href: '/about/', translationKey: 'nav_about', icon: 'about' },
      ],
    },
  ],
  topics: {
    enabled: true,
    label: '카테고리',
    translationKey: 'nav_topics',
    showCounts: true,
  },
} satisfies NavigationConfig

export function buildNavigationGroups(posts: PostEntry[]) {
  const groups = navigationConfig.groups.map((group) => ({
    ...group,
    items: group.items.map((item) => ({ ...item })),
  }))

  if (!navigationConfig.topics.enabled) {
    return groups
  }

  const categoryItems = buildCategoryItems(posts).map((item) => ({
    label: item.label,
    href: item.href,
    description: navigationConfig.topics.showCounts ? `${item.count}` : undefined,
    icon: 'topic' as const,
  }))

  return categoryItems.length > 0
    ? [
        ...groups,
        {
          label: navigationConfig.topics.label,
          translationKey: navigationConfig.topics.translationKey,
          items: categoryItems,
        },
      ]
    : groups
}
