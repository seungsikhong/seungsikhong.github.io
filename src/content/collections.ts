import postCollections from '../config/post-collections.json'
import { POST_CATEGORIES } from './categories'

export type PostCollectionConfig = {
  id: string
  label: string
  category: string
  description?: string
  order?: number
}

function normalizeCollectionConfig(collection: PostCollectionConfig): PostCollectionConfig {
  return {
    id: String(collection.id ?? '').trim(),
    label: String(collection.label ?? '').trim(),
    category: String(collection.category ?? '').trim(),
    description: collection.description ? String(collection.description).trim() : undefined,
    order: Number.isFinite(collection.order) ? Number(collection.order) : undefined,
  }
}

if (!Array.isArray(postCollections)) {
  throw new Error('Invalid post collection config.')
}

export const POST_COLLECTIONS = postCollections.map(normalizeCollectionConfig)

if (
  POST_COLLECTIONS.some(
    (collection) =>
      !collection.id ||
      !collection.label ||
      !collection.category ||
      !POST_CATEGORIES.includes(collection.category)
  )
) {
  throw new Error('Invalid post collection config.')
}

export const POST_COLLECTION_IDS = POST_COLLECTIONS.map((collection) => collection.id)

if (new Set(POST_COLLECTION_IDS).size !== POST_COLLECTION_IDS.length) {
  throw new Error('Duplicate post collection id.')
}

export const POST_COLLECTION_BY_ID = new Map(
  POST_COLLECTIONS.map((collection) => [collection.id, collection] as const)
)

export const POST_COLLECTION_ORDER = new Map(
  POST_COLLECTIONS.map((collection, index) => [
    collection.id,
    collection.order ?? index + 1,
  ] as const)
)
