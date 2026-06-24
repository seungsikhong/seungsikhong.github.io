import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { POST_CATEGORIES } from './content/categories'
import { POST_TAGS } from './content/tags'

const categorySchema = z.string().refine((category) => POST_CATEGORIES.includes(category), {
  message: 'Category is not registered in src/config/post-categories.json.',
})

const tagSchema = z.string().refine((tag) => POST_TAGS.includes(tag), {
  message: 'Tag is not registered in src/config/post-tags.json.',
})

const posts = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx}',
    base: './src/content/posts',
  }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    category: categorySchema,
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    comments: z.boolean().default(false),
    tags: z.array(tagSchema).default([]),
    ogImage: z.string().optional(),
  }),
})

export const collections = { posts }
