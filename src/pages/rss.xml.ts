import type { APIRoute } from 'astro'
import { siteMeta } from '../config/site'
import { getPublishedPosts } from '../utils/content'
import { getPostHref } from '../utils/posts'

export const prerender = true

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

export const GET: APIRoute = async () => {
  const posts = (await getPublishedPosts()).sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
  )
  const feedUrl = new URL('/rss.xml', siteMeta.url).toString()
  const latestDate = posts[0]?.data.updatedAt ?? posts[0]?.data.publishedAt ?? new Date()

  const items = posts
    .map((post) => {
      const url = new URL(getPostHref(post), siteMeta.url).toString()
      const date = post.data.updatedAt ?? post.data.publishedAt

      return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(post.data.excerpt)}</description>
      <category>${escapeXml(post.data.category)}</category>
      <pubDate>${date.toUTCString()}</pubDate>
    </item>`
    })
    .join('\n')

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteMeta.title)}</title>
    <link>${escapeXml(siteMeta.url)}</link>
    <description>${escapeXml(siteMeta.description)}</description>
    <language>ko</language>
    <lastBuildDate>${latestDate.toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}
