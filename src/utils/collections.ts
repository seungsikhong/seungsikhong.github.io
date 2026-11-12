import type { CollectionEntry } from 'astro:content'
import {
  POST_COLLECTION_BY_ID,
  POST_COLLECTION_ORDER,
  POST_COLLECTIONS,
  type PostCollectionConfig,
} from '../content/collections'

type PostEntry = CollectionEntry<'posts'>

export type PostCollectionGroup = {
  collection: PostCollectionConfig
  posts: PostEntry[]
}

function comparePostsInCollection(a: PostEntry, b: PostEntry) {
  const aOrder = a.data.collectionOrder ?? Number.MAX_SAFE_INTEGER
  const bOrder = b.data.collectionOrder ?? Number.MAX_SAFE_INTEGER
  if (aOrder !== bOrder) return aOrder - bOrder
  return a.data.publishedAt.getTime() - b.data.publishedAt.getTime()
}

function compareCollections(a: PostCollectionGroup, b: PostCollectionGroup) {
  const aOrder = POST_COLLECTION_ORDER.get(a.collection.id) ?? Number.MAX_SAFE_INTEGER
  const bOrder = POST_COLLECTION_ORDER.get(b.collection.id) ?? Number.MAX_SAFE_INTEGER
  if (aOrder !== bOrder) return aOrder - bOrder
  return a.collection.label.localeCompare(b.collection.label, 'en')
}

export function getPostCollection(collectionId?: string) {
  if (!collectionId) return undefined
  return POST_COLLECTION_BY_ID.get(collectionId)
}

export function getCollectionsByCategory(category: string) {
  return POST_COLLECTIONS.filter((collection) => collection.category === category).sort((a, b) => {
    const aOrder = POST_COLLECTION_ORDER.get(a.id) ?? Number.MAX_SAFE_INTEGER
    const bOrder = POST_COLLECTION_ORDER.get(b.id) ?? Number.MAX_SAFE_INTEGER
    if (aOrder !== bOrder) return aOrder - bOrder
    return a.label.localeCompare(b.label, 'en')
  })
}

export function buildCollectionGroups(posts: PostEntry[], category: string) {
  const postsByCollection = new Map<string, PostEntry[]>()
  const ungroupedPosts: PostEntry[] = []

  posts.forEach((post) => {
    const collection = getPostCollection(post.data.collection)
    if (!collection || collection.category !== category) {
      ungroupedPosts.push(post)
      return
    }

    const collectionPosts = postsByCollection.get(collection.id) ?? []
    collectionPosts.push(post)
    postsByCollection.set(collection.id, collectionPosts)
  })

  const groups = [...postsByCollection.entries()]
    .map(([id, collectionPosts]) => {
      const collection = POST_COLLECTION_BY_ID.get(id)
      if (!collection) return undefined

      return {
        collection,
        posts: collectionPosts.sort(comparePostsInCollection),
      }
    })
    .filter((group): group is PostCollectionGroup => Boolean(group))
    .sort(compareCollections)

  return {
    groups,
    ungroupedPosts: ungroupedPosts.sort(
      (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
    ),
  }
}

export function getCollectionPostNavigation(posts: PostEntry[], post: PostEntry) {
  const collection = getPostCollection(post.data.collection)
  if (!collection) return undefined

  const collectionPosts = posts
    .filter((item) => item.data.collection === collection.id)
    .sort(comparePostsInCollection)
  const index = collectionPosts.findIndex((item) => item.id === post.id)

  if (index < 0) return undefined

  return {
    collection,
    posts: collectionPosts,
    currentIndex: index,
    previousPost: collectionPosts[index - 1],
    nextPost: collectionPosts[index + 1],
  }
}
