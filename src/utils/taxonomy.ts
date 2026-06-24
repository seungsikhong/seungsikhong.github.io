import type { CollectionEntry } from 'astro:content'
import { POST_CATEGORIES, POST_CATEGORY_ORDER } from '../content/categories'
import { POST_TAGS, POST_TAG_ORDER } from '../content/tags'

type PostEntryLike = Pick<CollectionEntry<'posts'>, 'data'>

type TaxonomyItemOptions = {
  include?: readonly string[]
  includeEmpty?: boolean
}

function getTaxonomySlug(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '')

  return slug || 'untitled'
}

export function getCategorySlug(category: string) {
  return getTaxonomySlug(category)
}

export function getCategoryHref(category: string) {
  return `/topics/${getCategorySlug(category)}/`
}

export function getTagSlug(tag: string) {
  return getTaxonomySlug(tag)
}

export function getTagHref(tag: string) {
  return `/tags/${getTagSlug(tag)}/`
}

function buildItems({
  counts,
  labels,
  order,
  href,
  includeEmpty = false,
}: {
  counts: Map<string, number>
  labels: readonly string[]
  order: Map<string, number>
  href: (value: string) => string
  includeEmpty?: boolean
}) {
  const selectedLabels = includeEmpty
    ? [...labels]
    : labels.filter((label) => (counts.get(label) ?? 0) > 0)

  return selectedLabels
    .sort((a, b) => {
      const aOrder = order.get(a) ?? Number.MAX_SAFE_INTEGER
      const bOrder = order.get(b) ?? Number.MAX_SAFE_INTEGER
      if (aOrder !== bOrder) return aOrder - bOrder
      const countDiff = (counts.get(b) ?? 0) - (counts.get(a) ?? 0)
      if (countDiff !== 0) return countDiff
      return a.localeCompare(b, 'en')
    })
    .map((label) => ({
      label,
      href: href(label),
      count: counts.get(label) ?? 0,
    }))
}

export function buildCategoryItems(posts: PostEntryLike[], options: TaxonomyItemOptions = {}) {
  const labels = options.include ?? POST_CATEGORIES
  const counts = new Map(labels.map((label) => [label, 0] as const))

  posts.forEach((post) => {
    const category = post.data.category.trim()
    counts.set(category, (counts.get(category) || 0) + 1)
  })

  return buildItems({
    counts,
    labels,
    order: POST_CATEGORY_ORDER,
    href: getCategoryHref,
    includeEmpty: options.includeEmpty,
  })
}

export function buildTagItems(posts: PostEntryLike[], options: TaxonomyItemOptions = {}) {
  const labels = options.include ?? POST_TAGS
  const counts = new Map(labels.map((label) => [label, 0] as const))

  posts.forEach((post) => {
    post.data.tags.forEach((tag) => {
      const label = tag.trim()
      counts.set(label, (counts.get(label) || 0) + 1)
    })
  })

  return buildItems({
    counts,
    labels,
    order: POST_TAG_ORDER,
    href: getTagHref,
    includeEmpty: options.includeEmpty,
  })
}
