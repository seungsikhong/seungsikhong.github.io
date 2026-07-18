import type { CollectionEntry } from 'astro:content'

type PostEntryLike = Pick<CollectionEntry<'posts'>, 'id'>

export function getPostSlug(post: PostEntryLike) {
  return post.id.replace(/\.(md|mdx)$/i, '')
}

export function getPostHref(post: PostEntryLike) {
  return `/posts/${getPostSlug(post)}/`
}
