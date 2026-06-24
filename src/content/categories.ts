import postCategories from '../config/post-categories.json'

if (postCategories.length === 0) {
  throw new Error('At least one post category is required.')
}

export const POST_CATEGORIES = [
  postCategories[0],
  ...postCategories.slice(1),
] as [string, ...string[]]

export type PostCategory = (typeof POST_CATEGORIES)[number]

export const POST_CATEGORY_ORDER = new Map(
  POST_CATEGORIES.map((category, index) => [category, index] as const)
)
