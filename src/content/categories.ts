import postCategories from '../config/post-categories.json'

if (
  !Array.isArray(postCategories) ||
  postCategories.some((category) => typeof category !== 'string' || !category.trim())
) {
  throw new Error('Invalid post category config.')
}

export const POST_CATEGORIES = postCategories
  .map((category) => category.trim())
  .filter(Boolean)

export type PostCategory = (typeof POST_CATEGORIES)[number]

export const POST_CATEGORY_ORDER = new Map(
  POST_CATEGORIES.map((category, index) => [category, index] as const)
)
