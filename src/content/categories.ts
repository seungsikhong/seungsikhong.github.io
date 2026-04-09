export const POST_CATEGORIES = [
  'Architecture',
  'Implementation',
  'Interface',
  'Notes',
] as const

export type PostCategory = (typeof POST_CATEGORIES)[number]

export const POST_CATEGORY_ORDER = new Map(
  POST_CATEGORIES.map((category, index) => [category, index] as const)
)
