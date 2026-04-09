import type { APIRoute } from 'astro'
import { siteMeta } from '../config/site'
import { getPublishedPosts } from '../utils/content'
import { buildCategoryItems } from '../utils/taxonomy'
import { getPostHref } from '../utils/posts'

const STATIC_PATHS = ['/', '/posts/', '/about/']
export const prerender = true

export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts()
  const topics = buildCategoryItems(posts)

  const urls = [
    ...STATIC_PATHS.map((path) => new URL(path, siteMeta.url).toString()),
    ...posts.map((post) => new URL(getPostHref(post), siteMeta.url).toString()),
    ...topics.map((topic) => new URL(topic.href, siteMeta.url).toString()),
  ]

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
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
