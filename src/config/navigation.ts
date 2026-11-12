import type { CollectionEntry } from 'astro:content'
import { POST_CATEGORIES } from '../content/categories'
import { POST_MENU_TAGS, POST_TAGS } from '../content/tags'
import { buildCategoryItems, buildTagItems } from '../utils/taxonomy'
import navigationSettings from './navigation.json'

export type NavigationIcon = 'writing' | 'topic' | 'tag' | 'about'

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

type LinkNavigationItem = {
  type: 'link'
  label: string
  href: string
  enabled?: boolean
  icon?: NavigationIcon
}

type DynamicNavigationItem = {
  type: 'categories' | 'tags'
  source?: 'all' | 'menu'
  enabled?: boolean
  showCounts?: boolean
  includeEmpty?: boolean
  include?: string[]
  icon?: NavigationIcon
}

type NavigationSection = {
  label: string
  items: Array<LinkNavigationItem | DynamicNavigationItem>
}

type NavigationConfig = {
  sections: NavigationSection[]
}

type PostEntry = CollectionEntry<'posts'>

export const navigationConfig = navigationSettings as NavigationConfig

function resolveDynamicInclude(item: DynamicNavigationItem) {
  if (item.include) return item.include
  if (item.type === 'tags') {
    return item.source === 'all' ? POST_TAGS : POST_MENU_TAGS
  }

  return item.source === 'all' ? POST_CATEGORIES : undefined
}

function buildDynamicItems(item: DynamicNavigationItem, posts: PostEntry[]) {
  const include = resolveDynamicInclude(item)
  const taxonomyItems =
    item.type === 'categories'
      ? buildCategoryItems(posts, {
          include,
          includeEmpty: item.includeEmpty,
        })
      : buildTagItems(posts, {
          include,
          includeEmpty: item.includeEmpty,
        })

  return taxonomyItems.map((taxonomyItem) => ({
    label: taxonomyItem.label,
    href: taxonomyItem.href,
    description: item.showCounts ? `${taxonomyItem.count}` : undefined,
    icon: item.icon ?? (item.type === 'categories' ? 'topic' : 'tag'),
  }))
}

function buildSectionItems(section: NavigationSection, posts: PostEntry[]) {
  return section.items.flatMap((item) => {
    if (item.enabled === false) return []

    if (item.type === 'link') {
      return [
        {
          label: item.label,
          href: item.href,
          icon: item.icon,
        },
      ]
    }

    return buildDynamicItems(item, posts)
  })
}

export function buildNavigationGroups(posts: PostEntry[]) {
  return navigationConfig.sections
    .map((section) => ({
      label: section.label,
      items: buildSectionItems(section, posts),
    }))
    .filter((section) => section.items.length > 0)
}
