import type { APIRoute } from 'astro'
import { siteMeta } from '../config/site'
import { getPublishedPosts } from '../utils/content'
import { buildCategoryItems, buildTagItems } from '../utils/taxonomy'
import { getPostHref } from '../utils/posts'

const STATIC_PATHS = ['/', '/posts/', '/about/']
export const prerender = true

type SitemapEntry = {
  loc: string
  lastmod?: Date
}

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const formatSitemapDate = (date: Date) => date.toISOString().slice(0, 10)

export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts()
  const topics = buildCategoryItems(posts)
  const tags = buildTagItems(posts)
  const latestPostByCategory = new Map<string, Date>()
  const latestPostByTag = new Map<string, Date>()

  posts.forEach((post) => {
    const current = latestPostByCategory.get(post.data.category)
    const next = post.data.updatedAt ?? post.data.publishedAt
    if (!current || next.getTime() > current.getTime()) {
      latestPostByCategory.set(post.data.category, next)
    }

    post.data.tags.forEach((tag) => {
      const currentTag = latestPostByTag.get(tag)
      if (!currentTag || next.getTime() > currentTag.getTime()) {
        latestPostByTag.set(tag, next)
      }
    })
  })

  const urls: SitemapEntry[] = [
    ...STATIC_PATHS.map((path) => ({ loc: new URL(path, siteMeta.url).toString() })),
    ...posts.map((post) => ({
      loc: new URL(getPostHref(post), siteMeta.url).toString(),
      lastmod: post.data.updatedAt ?? post.data.publishedAt,
    })),
    ...topics.map((topic) => ({
      loc: new URL(topic.href, siteMeta.url).toString(),
      lastmod: latestPostByCategory.get(topic.label),
    })),
    ...tags.map((tag) => ({
      loc: new URL(tag.href, siteMeta.url).toString(),
      lastmod: latestPostByTag.get(tag.label),
    })),
  ]

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, lastmod }) => `  <url>
    <loc>${escapeXml(loc)}</loc>${lastmod ? `\n    <lastmod>${formatSitemapDate(lastmod)}</lastmod>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
