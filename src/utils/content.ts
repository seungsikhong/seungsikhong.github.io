import { readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { getCollection, type CollectionEntry } from 'astro:content'

const POSTS_DIR = resolve(process.cwd(), 'src/content/posts')

function hasPostFilesInDirectory(directory: string): boolean {
  return readdirSync(directory, { withFileTypes: true }).some((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return hasPostFilesInDirectory(path)
    return entry.isFile() && /\.(md|mdx)$/i.test(entry.name)
  })
}

export function hasPostFiles() {
  try {
    return hasPostFilesInDirectory(POSTS_DIR)
  } catch {
    return false
  }
}

export async function getPublishedPosts() {
  if (!hasPostFiles()) {
    return [] as CollectionEntry<'posts'>[]
  }

  const now = new Date()
  return getCollection('posts', ({ data }) => !data.draft && data.publishedAt <= now)
}
