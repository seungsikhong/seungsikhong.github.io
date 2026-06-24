import type { CollectionEntry } from 'astro:content'
import { buildCategoryItems } from '../utils/taxonomy'

export type NavigationIcon = 'writing' | 'topic' | 'about'

export type NavigationItem = {
  label: string
  href: string
  description?: string
  icon?: NavigationIcon
}

export type NavigationGroup = {
  label: string
  items: NavigationItem[]
}

export type NavigationConfig = {
  groups: NavigationGroup[]
  topics: {
    enabled: boolean
    label: string
    showCounts: boolean
  }
}

type PostEntry = CollectionEntry<'posts'>

export const navigationConfig = {
  groups: [
    {
      label: '메뉴',
      items: [
        { label: '글', href: '/posts/', icon: 'writing' },
        { label: '소개', href: '/about/', icon: 'about' },
      ],
    },
  ],
  topics: {
    enabled: true,
    label: '카테고리',
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
          items: categoryItems,
        },
      ]
    : groups
}
