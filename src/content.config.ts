import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { POST_CATEGORIES } from './content/categories'

const posts = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx}',
    base: './src/content/posts',
  }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    category: z.enum(POST_CATEGORIES),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    comments: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    ogImage: z.string().optional(),
  }),
})

export const collections = { posts }
