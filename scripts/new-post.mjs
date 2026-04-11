import { mkdirSync, existsSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const postsDir = join(root, 'src', 'content', 'posts')
const imageRoot = join(root, 'public', 'images', 'posts')
const ogRoot = join(root, 'public', 'og', 'posts')
const allowedCategories = ['Architecture', 'Implementation', 'Interface', 'Notes']

const args = process.argv.slice(2)
const readArg = (name) => {
  const direct = args.find((arg) => arg.startsWith(`${name}=`))
  if (direct) return direct.slice(name.length + 1)
  const index = args.indexOf(name)
  return index >= 0 ? args[index + 1] : undefined
}

const title = readArg('--title')
const category = readArg('--category') || 'Notes'
const providedSlug = readArg('--slug')

if (!title) {
  console.error('Usage: npm run new-post -- --title "Post title" --category Notes --slug my-post')
  process.exit(1)
}

if (!allowedCategories.includes(category)) {
  console.error(`Invalid category: ${category}`)
  console.error(`Allowed categories: ${allowedCategories.join(', ')}`)
  process.exit(1)
}

const today = new Date().toISOString().slice(0, 10)

const slugify = (value) => {
  const slug = value
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return slug || `post-${today}`
}

const slug = providedSlug || slugify(title)
const mdPath = join(postsDir, `${slug}.md`)
const mdxPath = join(postsDir, `${slug}.mdx`)
const markdownPath = mdxPath
const imageDir = join(imageRoot, slug)
const ogSvgPath = join(ogRoot, `${slug}.svg`)
const ogPngPath = join(ogRoot, `${slug}.png`)

if (existsSync(mdPath) || existsSync(mdxPath)) {
  console.error(`Post already exists: ${existsSync(mdxPath) ? mdxPath : mdPath}`)
  process.exit(1)
}

mkdirSync(postsDir, { recursive: true })
mkdirSync(imageDir, { recursive: true })
mkdirSync(ogRoot, { recursive: true })
writeFileSync(join(imageDir, '.gitkeep'), '')

const measure = (char) => (/[^ -~]/.test(char) ? 2 : 1)

const wrapText = (value, maxUnits = 20, maxLines = 3) => {
  const words = value.split(/\s+/)
  const lines = []
  let current = ''
  let currentUnits = 0

  const push = () => {
    if (current) lines.push(current.trim())
    current = ''
    currentUnits = 0
  }

  for (const word of words) {
    const wordUnits = [...word].reduce((sum, char) => sum + measure(char), 0)
    const extra = current ? 1 : 0

    if (current && currentUnits + extra + wordUnits > maxUnits) push()

    if (!current && wordUnits > maxUnits) {
      let segment = ''
      let segmentUnits = 0
      for (const char of word) {
        const units = measure(char)
        if (segmentUnits + units > maxUnits) {
          lines.push(segment)
          segment = char
          segmentUnits = units
          if (lines.length === maxLines) break
        } else {
          segment += char
          segmentUnits += units
        }
      }
      current = segment
      currentUnits = segmentUnits
      continue
    }

    current += `${current ? ' ' : ''}${word}`
    currentUnits += extra + wordUnits

    if (lines.length === maxLines) break
  }

  push()

  return lines.slice(0, maxLines).map((line, index, all) => {
    if (index !== all.length - 1 || all.length !== maxLines) return line
    return words.join(' ') !== all.join(' ') ? `${line}…` : line
  })
}

const escapeXml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const titleLines = wrapText(title)
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0B1020"/>
      <stop offset="1" stop-color="#131B31"/>
    </linearGradient>
    <radialGradient id="glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(980 90) rotate(128.659) scale(380 460)">
      <stop stop-color="#315FC9" stop-opacity="0.38"/>
      <stop offset="1" stop-color="#315FC9" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" rx="36" fill="url(#bg)"/>
  <rect width="1200" height="630" rx="36" fill="url(#glow)"/>
  <rect x="44" y="44" width="1112" height="542" rx="28" fill="rgba(16,23,40,0.35)" stroke="rgba(138,168,255,0.18)"/>
  <text x="92" y="132" fill="#8AA8FF" font-family="Pretendard, Apple SD Gothic Neo, Noto Sans KR, system-ui, sans-serif" font-size="22" font-weight="600" letter-spacing="0.32em">SEUNGSIK HONG</text>
  <text x="92" y="244" fill="#E7EBF3" font-family="Pretendard, Apple SD Gothic Neo, Noto Sans KR, system-ui, sans-serif" font-size="58" font-weight="700">
    ${titleLines
      .map((line, index) => `<tspan x="92" dy="${index === 0 ? 0 : 74}">${escapeXml(line)}</tspan>`)
      .join('')}
  </text>
  <text x="92" y="486" fill="#95A1B7" font-family="Pretendard, Apple SD Gothic Neo, Noto Sans KR, system-ui, sans-serif" font-size="28">Code and thoughts.</text>
  <text x="92" y="532" fill="#95A1B7" font-family="Pretendard, Apple SD Gothic Neo, Noto Sans KR, system-ui, sans-serif" font-size="28">Still building.</text>
  <text x="1008" y="548" text-anchor="end" fill="#8AA8FF" font-family="Pretendard, Apple SD Gothic Neo, Noto Sans KR, system-ui, sans-serif" font-size="24">${today}</text>
</svg>
`

writeFileSync(ogSvgPath, svg)

let ogImagePath = `/og/posts/${slug}.svg`
try {
  execFileSync('sips', ['-s', 'format', 'png', ogSvgPath, '--out', ogPngPath], { stdio: 'ignore' })
  ogImagePath = `/og/posts/${slug}.png`
} catch {
  // Keep SVG as fallback if PNG conversion is unavailable.
}

const markdown = `---
title: ${title}
excerpt: Add a short summary.
category: ${category}
publishedAt: ${today}
comments: false
tags:
  - ${category}
ogImage: ${ogImagePath}
---

## Overview

Start writing here.

## Notes

- Replace this draft with your actual content.
- \`PostImage\` and \`Callout\` are available in MDX posts without import.

\`\`\`mdx
<Callout type="note" title="Note">
  A decision, reminder, or tradeoff.
</Callout>

<PostImage
  src="/images/posts/${slug}/example.png"
  alt="Add image description"
  caption="Optional caption"
  size="wide"
/>
\`\`\`
`

writeFileSync(markdownPath, markdown)

console.log(`Created post: ${markdownPath}`)
console.log(`Created image directory: ${imageDir}`)
console.log(`Created OG image: ${ogImagePath}`)
console.log('')
console.log('Next steps:')
console.log(`1. Put images into: public/images/posts/${slug}/`)
console.log(`2. Or run: npm run add-image -- --slug ${slug} "/absolute/path/to/image.png"`)
console.log(`3. Start writing in: src/content/posts/${slug}.mdx`)
