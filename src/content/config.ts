import { defineCollection, z } from 'astro:content'
import { POST_CATEGORIES } from './categories'

const posts = defineCollection({
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
