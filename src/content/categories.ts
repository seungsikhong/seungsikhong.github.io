import postCategories from '../config/post-categories.json'

function getTaxonomySlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
}

if (
  !Array.isArray(postCategories) ||
  postCategories.some((category) => typeof category !== 'string' || !category.trim())
) {
  throw new Error('Invalid post category config.')
}

export const POST_CATEGORIES = postCategories
  .map((category) => category.trim())
  .filter(Boolean)

if (new Set(POST_CATEGORIES).size !== POST_CATEGORIES.length) {
  throw new Error('Duplicate post category.')
}

const POST_CATEGORY_SLUGS = POST_CATEGORIES.map(getTaxonomySlug)

if (new Set(POST_CATEGORY_SLUGS).size !== POST_CATEGORY_SLUGS.length) {
  throw new Error('Duplicate post category slug.')
}

export type PostCategory = (typeof POST_CATEGORIES)[number]

export const POST_CATEGORY_ORDER = new Map(
  POST_CATEGORIES.map((category, index) => [category, index] as const)
)
