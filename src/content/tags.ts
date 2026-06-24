import postTags from '../config/post-tags.json'

type PostTagConfig = {
  label: string
  menu?: boolean
}

function normalizeTagConfig(tag: string | PostTagConfig): PostTagConfig {
  if (typeof tag === 'string') return { label: tag }
  if (tag && typeof tag === 'object') return tag
  return { label: '' }
}

if (!Array.isArray(postTags)) {
  throw new Error('Invalid post tag config.')
}

const tagConfig = postTags.map(normalizeTagConfig)

if (tagConfig.some((tag) => typeof tag.label !== 'string' || !tag.label.trim())) {
  throw new Error('Invalid post tag config.')
}

export const POST_TAGS = tagConfig
  .map((tag) => tag.label.trim())
  .filter(Boolean)

export const POST_MENU_TAGS = tagConfig
  .filter((tag) => tag.menu)
  .map((tag) => tag.label.trim())
  .filter(Boolean)

export type PostTag = (typeof POST_TAGS)[number]

export const POST_TAG_ORDER = new Map(
  POST_TAGS.map((tag, index) => [tag, index] as const)
)
