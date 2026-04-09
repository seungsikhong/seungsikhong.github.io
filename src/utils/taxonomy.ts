import type { CollectionEntry } from 'astro:content'
import { POST_CATEGORY_ORDER } from '../content/categories'

type PostEntryLike = Pick<CollectionEntry<'posts'>, 'data'>

export function getCategorySlug(category: string) {
  return category
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getCategoryHref(category: string) {
  return `/topics/${getCategorySlug(category)}/`
}

export function buildCategoryItems(posts: PostEntryLike[]) {
  const counts = new Map<string, number>()

  posts.forEach((post) => {
    const category = post.data.category.trim()
    counts.set(category, (counts.get(category) || 0) + 1)
  })

  return Array.from(counts.entries())
    .sort((a, b) => {
      const aOrder = POST_CATEGORY_ORDER.get(a[0]) ?? Number.MAX_SAFE_INTEGER
      const bOrder = POST_CATEGORY_ORDER.get(b[0]) ?? Number.MAX_SAFE_INTEGER
      if (aOrder !== bOrder) return aOrder - bOrder
      if (b[1] !== a[1]) return b[1] - a[1]
      return a[0].localeCompare(b[0], 'en')
    })
    .map(([category, count]) => ({
      label: category,
      href: getCategoryHref(category),
      count,
    }))
}
