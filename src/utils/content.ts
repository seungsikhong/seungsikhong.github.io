import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { getCollection, type CollectionEntry } from 'astro:content'

const POSTS_DIR = resolve(process.cwd(), 'src/content/posts')

export function hasPostFiles() {
  try {
    return readdirSync(POSTS_DIR).some((file) => /\.(md|mdx)$/i.test(file))
  } catch {
    return false
  }
}

export async function getPublishedPosts() {
  if (!hasPostFiles()) {
    return [] as CollectionEntry<'posts'>[]
  }

  return getCollection('posts', ({ data }) => !data.draft)
}
