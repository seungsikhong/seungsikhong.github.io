import { mkdirSync, existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const postsDir = join(root, 'src', 'content', 'posts')
const imageRoot = join(root, 'public', 'images', 'posts')
const ogRoot = join(root, 'public', 'og', 'posts')
const categoriesPath = join(root, 'src', 'config', 'post-categories.json')
const tagsPath = join(root, 'src', 'config', 'post-tags.json')
const collectionsPath = join(root, 'src', 'config', 'post-collections.json')
let allowedCategories = JSON.parse(readFileSync(categoriesPath, 'utf8'))
let rawTags = JSON.parse(readFileSync(tagsPath, 'utf8'))
let rawCollections = JSON.parse(readFileSync(collectionsPath, 'utf8'))
let allowedTags = Array.isArray(rawTags)
  ? rawTags.map((tag) => (typeof tag === 'string' ? tag : tag?.label))
  : []

if (
  !Array.isArray(allowedCategories) ||
  allowedCategories.some((category) => typeof category !== 'string' || !category.trim())
) {
  console.error(`Invalid categories file: ${categoriesPath}`)
  process.exit(1)
}

if (
  !Array.isArray(rawTags) ||
  allowedTags.some((tag) => typeof tag !== 'string' || !tag.trim())
) {
  console.error(`Invalid tags file: ${tagsPath}`)
  process.exit(1)
}

if (
  !Array.isArray(rawCollections) ||
  rawCollections.some(
    (collection) =>
      !collection ||
      typeof collection !== 'object' ||
      typeof collection.id !== 'string' ||
      typeof collection.label !== 'string' ||
      typeof collection.category !== 'string' ||
      !collection.id.trim() ||
      !collection.label.trim() ||
      !collection.category.trim()
  )
) {
  console.error(`Invalid collections file: ${collectionsPath}`)
  process.exit(1)
}

let defaultCategory = allowedCategories[0]
let categoryByNormalizedValue
let tagByNormalizedValue
const isInteractive = Boolean(input.isTTY && output.isTTY)
let promptInterface

const normalizeName = (value) => value.trim().replace(/\s+/g, ' ')
const normalizeKey = (value) => normalizeName(value).toLowerCase()
const slugify = (value) => {
  const slug = value
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return slug
}
const slugifyPath = (value) =>
  value
    .split('/')
    .map((segment) => slugify(segment))
    .filter(Boolean)
    .join('/')

const writeJson = (path, value) => {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`)
}

const refreshMetadataLookups = () => {
  allowedTags = Array.isArray(rawTags)
    ? rawTags.map((tag) => (typeof tag === 'string' ? tag : tag?.label))
    : []
  defaultCategory = allowedCategories[0]
  categoryByNormalizedValue = new Map(
    allowedCategories.map((category) => [normalizeKey(category), category])
  )
  tagByNormalizedValue = new Map(allowedTags.map((tag) => [normalizeKey(tag), tag]))
}

refreshMetadataLookups()

const args = process.argv.slice(2)
const readArg = (name) => {
  const direct = args.find((arg) => arg.startsWith(`${name}=`))
  if (direct) return direct.slice(name.length + 1)
  const index = args.indexOf(name)
  return index >= 0 ? args[index + 1] : undefined
}
const hasArg = (name) => args.some((arg) => arg === name || arg.startsWith(`${name}=`))

const printUsage = () => {
  console.log('Usage:')
  console.log('  npm run blog:new')
  console.log(
    '  npm run blog:new -- --title "글 제목" --excerpt "글 요약" --category "카테고리" --collection "컬렉션" --tags "태그1,태그2"'
  )
  console.log('  npm run blog:new -- --title "글 제목" --category "카테고리" --slug ai/01-my-post')
}

const closePrompt = () => {
  if (promptInterface) {
    promptInterface.close()
    promptInterface = undefined
  }
}

const fail = (message, details = []) => {
  closePrompt()
  console.error(message)
  details.forEach((detail) => console.error(detail))
  process.exit(1)
}

const ask = async (question) => {
  promptInterface ??= createInterface({ input, output })
  return (await promptInterface.question(question)).trim()
}

const printChoices = (title, choices, render = (choice) => choice) => {
  console.log(title)
  choices.forEach((choice, index) => {
    console.log(`  ${index + 1}. ${render(choice)}`)
  })
}

const readChoice = (value, choices, normalizedMap) => {
  const trimmed = value.trim()
  const choiceIndex = Number(trimmed)
  if (Number.isInteger(choiceIndex) && choiceIndex >= 1 && choiceIndex <= choices.length) {
    return choices[choiceIndex - 1]
  }

  return normalizedMap.get(normalizeKey(trimmed)) ?? trimmed
}

const providedTitle = readArg('--title')?.trim()
const providedExcerpt = readArg('--excerpt')?.trim()
const providedCategory = readArg('--category')?.trim()
const providedCollection = readArg('--collection')?.trim()
const providedCollectionOrder = readArg('--collection-order')?.trim()
const providedSlug = readArg('--slug')?.trim()
const providedTags = readArg('--tags')
const hasProvidedExcerpt = hasArg('--excerpt')
const hasProvidedCategory = hasArg('--category')
const hasProvidedTags = hasArg('--tags')

if (args.includes('--help') || args.includes('-h')) {
  printUsage()
  process.exit(0)
}

const resolveTitle = async () => {
  if (providedTitle) return providedTitle

  if (!isInteractive) {
    fail('Usage: npm run blog:new -- --title "글 제목" --category "카테고리" --tags "태그"')
  }

  const answer = await ask('Title: ')
  if (!answer) fail('Title is required.')
  return answer
}

const resolveCategory = async () => {
  if (providedCategory) {
    return readChoice(providedCategory, allowedCategories, categoryByNormalizedValue)
  }

  if (hasProvidedCategory && defaultCategory) return defaultCategory

  if (allowedCategories.length === 0 && isInteractive) {
    const answer = await ask('Category: ')
    if (!answer) fail('Category is required.')
    return normalizeName(answer)
  }

  if (!isInteractive) return defaultCategory

  console.log('')
  printChoices('Categories', allowedCategories)
  const answer = await ask(`Category [1. ${defaultCategory}]: `)
  return answer ? readChoice(answer, allowedCategories, categoryByNormalizedValue) : defaultCategory
}

const getDefaultExcerpt = (value) => `${value}에 대해 정리합니다.`

const resolveExcerpt = async (value) => {
  const defaultExcerpt = getDefaultExcerpt(value)
  if (hasProvidedExcerpt) return providedExcerpt || defaultExcerpt

  if (!isInteractive) return defaultExcerpt

  const answer = await ask(`Excerpt [${defaultExcerpt}]: `)
  return answer || defaultExcerpt
}

const parseTags = (value) => [
  ...new Set(
    value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
      .map((tag) => readChoice(tag, allowedTags, tagByNormalizedValue))
  ),
]

const resolveTags = async () => {
  if (hasProvidedTags) return providedTags ? parseTags(providedTags) : []
  if (!isInteractive || allowedTags.length === 0) return []

  console.log('')
  printChoices('Tags', allowedTags)
  const answer = await ask('Tags, comma-separated names or numbers (optional): ')
  return answer ? parseTags(answer) : []
}

const getEditDistance = (left, right) => {
  const a = [...normalizeKey(left)]
  const b = [...normalizeKey(right)]
  const matrix = Array.from({ length: a.length + 1 }, (_, row) => [row])

  for (let column = 1; column <= b.length; column += 1) {
    matrix[0][column] = column
  }

  for (let row = 1; row <= a.length; row += 1) {
    for (let column = 1; column <= b.length; column += 1) {
      const cost = a[row - 1] === b[column - 1] ? 0 : 1
      matrix[row][column] = Math.min(
        matrix[row - 1][column] + 1,
        matrix[row][column - 1] + 1,
        matrix[row - 1][column - 1] + cost
      )
    }
  }

  return matrix[a.length][b.length]
}

const findSimilarChoices = (value, choices) => {
  const key = normalizeKey(value)
  if (!key) return []

  return choices
    .map((choice) => {
      const choiceKey = normalizeKey(choice)
      const distance = getEditDistance(key, choiceKey)
      const contains = key.includes(choiceKey) || choiceKey.includes(key)
      const maxLength = Math.max(key.length, choiceKey.length)
      const limit = Math.max(1, Math.floor(maxLength * 0.35))

      return {
        choice,
        score: contains ? 0 : distance,
        similar: contains || distance <= limit,
      }
    })
    .filter(({ similar }) => similar)
    .sort((a, b) => a.score - b.score || a.choice.localeCompare(b.choice))
    .slice(0, 3)
    .map(({ choice }) => choice)
}

const readSimilarChoice = async (type, value, similarChoices, addValue) => {
  const addIndex = similarChoices.length + 1
  console.log('')
  console.log(`Unknown ${type}: ${value}`)
  printChoices(`Similar ${type}s`, similarChoices)
  console.log(`  ${addIndex}. Add new ${type}: ${value}`)

  const answer = await ask(`Choose 1-${addIndex}, or c to cancel [${addIndex}]: `)
  const normalizedAnswer = answer.toLowerCase()

  if (!answer || Number(answer) === addIndex || ['a', 'add', 'new', 'y', 'yes'].includes(normalizedAnswer)) {
    return addValue(value)
  }

  if (['c', 'cancel', 'q', 'quit', 'n', 'no'].includes(normalizedAnswer)) {
    fail(`Canceled ${type} selection.`)
  }

  const choiceIndex = Number(answer)
  if (Number.isInteger(choiceIndex) && choiceIndex >= 1 && choiceIndex <= similarChoices.length) {
    return similarChoices[choiceIndex - 1]
  }

  const existing = new Map(similarChoices.map((choice) => [normalizeKey(choice), choice])).get(
    normalizeKey(answer)
  )
  if (existing) return existing

  fail(`Invalid ${type} choice: ${answer}`)
}

const addCategory = (value) => {
  const name = normalizeName(value)
  allowedCategories.push(name)
  writeJson(categoriesPath, allowedCategories)
  refreshMetadataLookups()
  console.log(`Added category: ${name}`)
  return name
}

const addTag = (value) => {
  const name = normalizeName(value)
  rawTags.push({ label: name, menu: false })
  writeJson(tagsPath, rawTags)
  refreshMetadataLookups()
  console.log(`Added tag: ${name} (menu=false)`)
  return name
}

const getCollectionsForCategory = (category) =>
  rawCollections
    .filter((collection) => collection.category === category)
    .sort((a, b) => {
      const aOrder = Number.isFinite(a.order) ? Number(a.order) : Number.MAX_SAFE_INTEGER
      const bOrder = Number.isFinite(b.order) ? Number(b.order) : Number.MAX_SAFE_INTEGER
      if (aOrder !== bOrder) return aOrder - bOrder
      return a.label.localeCompare(b.label, 'en')
    })

const getUniqueCollectionId = (label, category) => {
  const baseId = slugify(label) || `collection-${rawCollections.length + 1}`
  const existingIds = new Set(rawCollections.map((collection) => normalizeKey(collection.id)))
  if (!existingIds.has(normalizeKey(baseId))) return baseId

  const categorySegment = slugify(category)
  const prefixedId = categorySegment ? `${categorySegment}-${baseId}` : baseId
  if (!existingIds.has(normalizeKey(prefixedId))) return prefixedId

  let index = 2
  let nextId = `${prefixedId}-${index}`
  while (existingIds.has(normalizeKey(nextId))) {
    index += 1
    nextId = `${prefixedId}-${index}`
  }

  return nextId
}

const addCollection = (value, category) => {
  const label = normalizeName(value)
  const id = getUniqueCollectionId(label, category)
  const categoryCollections = getCollectionsForCategory(category)
  const nextOrder =
    Math.max(0, ...categoryCollections.map((collection) => Number(collection.order) || 0)) + 1
  const collection = {
    id,
    label,
    category,
    description: '',
    order: nextOrder,
  }

  rawCollections.push(collection)
  writeJson(collectionsPath, rawCollections)
  refreshMetadataLookups()
  console.log(`Added collection: ${label} (${id})`)
  return collection
}

const resolveMetadataValue = async ({ type, value, choices, normalizedMap, addValue }) => {
  const name = normalizeName(value)
  const existing = normalizedMap.get(normalizeKey(name))
  if (existing) return existing

  const similarChoices = findSimilarChoices(name, choices)
  if (similarChoices.length > 0) {
    if (isInteractive) {
      return readSimilarChoice(type, name, similarChoices, addValue)
    }

    fail(`Unknown ${type}: ${name}`, [
      `Similar ${type}s: ${similarChoices.join(', ')}`,
      `Run this command in an interactive terminal to choose or add a new ${type}.`,
    ])
  }

  return addValue(name)
}

const resolveCategoryMetadata = async (value) => {
  if (!value) {
    fail(`Category is required.`, ['Add a category first or pass --category "Name".'])
  }

  return resolveMetadataValue({
    type: 'category',
    value,
    choices: allowedCategories,
    normalizedMap: categoryByNormalizedValue,
    addValue: addCategory,
  })
}

const resolveTagMetadata = async (values) => {
  const resolvedTags = []

  for (const tag of values) {
    const resolvedTag = await resolveMetadataValue({
      type: 'tag',
      value: tag,
      choices: allowedTags,
      normalizedMap: tagByNormalizedValue,
      addValue: addTag,
    })

    if (!resolvedTags.includes(resolvedTag)) resolvedTags.push(resolvedTag)
  }

  return resolvedTags
}

const resolveCollection = async (category) => {
  const categoryCollections = getCollectionsForCategory(category)
  const emptyValues = new Set(['', 'none', 'no', 'n', '-'])
  const categoryCollectionByNormalizedValue = new Map(
    categoryCollections.flatMap((collection) => [
      [normalizeKey(collection.id), collection],
      [normalizeKey(collection.label), collection],
    ])
  )

  if (providedCollection !== undefined) {
    if (emptyValues.has(providedCollection.toLowerCase())) return undefined

    const existing = categoryCollectionByNormalizedValue.get(normalizeKey(providedCollection))
    if (existing) return existing

    const similarChoices = findSimilarChoices(
      providedCollection,
      categoryCollections.flatMap((collection) => [collection.id, collection.label])
    )
    if (similarChoices.length > 0 && isInteractive) {
      const resolved = await readSimilarChoice('collection', providedCollection, similarChoices, (value) =>
        addCollection(value, category)
      )
      if (typeof resolved === 'string') {
        return (
          categoryCollectionByNormalizedValue.get(normalizeKey(resolved)) ??
          addCollection(resolved, category)
        )
      }
      return resolved
    }

    if (similarChoices.length > 0) {
      fail(`Unknown collection: ${providedCollection}`, [
        `Similar collections: ${similarChoices.join(', ')}`,
        'Run this command in an interactive terminal to choose or add a new collection.',
      ])
    }

    return addCollection(providedCollection, category)
  }

  if (!isInteractive || categoryCollections.length === 0) return undefined

  console.log('')
  console.log('Collections')
  console.log('  0. No collection')
  categoryCollections.forEach((collection, index) => {
    console.log(`  ${index + 1}. ${collection.label}`)
  })

  const answer = await ask('Collection [0. No collection]: ')
  if (!answer || emptyValues.has(answer.toLowerCase()) || answer === '0') return undefined

  const choiceIndex = Number(answer)
  if (
    Number.isInteger(choiceIndex) &&
    choiceIndex >= 1 &&
    choiceIndex <= categoryCollections.length
  ) {
    return categoryCollections[choiceIndex - 1]
  }

  const existing = categoryCollectionByNormalizedValue.get(normalizeKey(answer))
  if (existing) return existing

  return addCollection(answer, category)
}

const title = await resolveTitle()
const category = await resolveCategoryMetadata(await resolveCategory())
const excerpt = await resolveExcerpt(title)
const collection = await resolveCollection(category)
const tags = await resolveTagMetadata(await resolveTags())
closePrompt()

const getToday = () => {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

const today = getToday()

const postExists = (slug) =>
  existsSync(join(postsDir, `${slug}.md`)) || existsSync(join(postsDir, `${slug}.mdx`))

const readPostFiles = (dir = postsDir) => {
  if (!existsSync(dir)) return []

  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    const stats = statSync(path)
    if (stats.isDirectory()) return readPostFiles(path)
    return /\.(md|mdx)$/i.test(path) ? [path] : []
  })
}

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const getNextCollectionOrder = (collectionId) => {
  if (!collectionId) return undefined

  const collectionPattern = new RegExp(`^collection:\\s*["']?${escapeRegExp(collectionId)}["']?\\s*$`, 'm')
  const orderPattern = /^collectionOrder:\s*(\d+)\s*$/m
  const orders = readPostFiles()
    .map((path) => readFileSync(path, 'utf8'))
    .filter((content) => collectionPattern.test(content))
    .map((content) => Number(content.match(orderPattern)?.[1] ?? 0))
    .filter((order) => Number.isInteger(order) && order > 0)

  return Math.max(0, ...orders) + 1
}

const parseCollectionOrder = (value) => {
  if (!value) return undefined
  const order = Number(value)
  if (!Number.isInteger(order) || order <= 0) {
    fail(`Invalid collection order: ${value}`, ['Use a positive integer.'])
  }

  return order
}

const collectionOrder = collection
  ? parseCollectionOrder(providedCollectionOrder) ?? getNextCollectionOrder(collection.id) ?? 1
  : undefined

const getAutoSlug = () => {
  const categorySegment = slugify(category) || 'posts'
  const titleSegment = slugify(title) || 'post'
  const base = collection
    ? `${categorySegment}/${String(collectionOrder ?? 1).padStart(2, '0')}-${titleSegment}`
    : `${categorySegment}/${titleSegment}`
  const initialSlug = base
  let slug = initialSlug
  let index = 2

  while (postExists(slug)) {
    slug = `${initialSlug}-${index}`
    index += 1
  }

  return slug
}

const slug = providedSlug ? slugifyPath(providedSlug) || getAutoSlug() : getAutoSlug()
const mdPath = join(postsDir, `${slug}.md`)
const mdxPath = join(postsDir, `${slug}.mdx`)
const markdownPath = mdxPath
const imageDir = join(imageRoot, slug)
const ogSvgPath = join(ogRoot, `${slug}.svg`)
const ogPngPath = join(ogRoot, `${slug}.png`)
const tagsFrontmatter =
  tags.length > 0
    ? `tags:\n${tags.map((tag) => `  - ${JSON.stringify(tag)}`).join('\n')}`
    : 'tags: []'
const collectionFrontmatter = collection
  ? `collection: ${JSON.stringify(collection.id)}\ncollectionOrder: ${collectionOrder}`
  : ''

if (existsSync(mdPath) || existsSync(mdxPath)) {
  console.error(`Post already exists: ${existsSync(mdxPath) ? mdxPath : mdPath}`)
  process.exit(1)
}

mkdirSync(dirname(markdownPath), { recursive: true })
mkdirSync(imageDir, { recursive: true })
mkdirSync(dirname(ogSvgPath), { recursive: true })
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
  <text x="92" y="486" fill="#95A1B7" font-family="Pretendard, Apple SD Gothic Neo, Noto Sans KR, system-ui, sans-serif" font-size="28">개발과 생각의 기록.</text>
  <text x="92" y="532" fill="#95A1B7" font-family="Pretendard, Apple SD Gothic Neo, Noto Sans KR, system-ui, sans-serif" font-size="28">AI와 구현 경험을 남깁니다.</text>
  <text x="1008" y="548" text-anchor="end" fill="#8AA8FF" font-family="Pretendard, Apple SD Gothic Neo, Noto Sans KR, system-ui, sans-serif" font-size="24">${today}</text>
</svg>
`

writeFileSync(ogSvgPath, svg)

let ogImagePath = `/og/posts/${slug}.svg`
const renderPngWithSharp = async () => {
  try {
    const { default: sharp } = await import('sharp')
    await sharp(ogSvgPath).png().toFile(ogPngPath)
    return true
  } catch {
    return false
  }
}
const renderPngWithSips = () => {
  try {
    execFileSync('sips', ['-s', 'format', 'png', ogSvgPath, '--out', ogPngPath], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

if ((await renderPngWithSharp()) || renderPngWithSips()) {
  ogImagePath = `/og/posts/${slug}.png`
}

const markdown = `---
title: ${JSON.stringify(title)}
excerpt: ${JSON.stringify(excerpt)}
category: ${JSON.stringify(category)}
publishedAt: ${today}
draft: true
comments: false
${collectionFrontmatter}
${tagsFrontmatter}
ogImage: ${ogImagePath}
---

{/*
도입 문단을 2~3문장으로 적습니다.
글을 쓰게 된 배경, 이 글에서 다룰 범위, 읽는 사람이 가져갈 내용을 자연스럽게 연결합니다.
*/}

## 핵심 개념

{/*
주요 개념을 정리합니다.
글 성격에 맞게 제목은 자유롭게 바꿔도 됩니다.
*/}

## 내가 이해한 흐름

{/*
예시, 경험, 판단, 헷갈렸던 지점을 순서대로 적습니다.
필요하면 README의 MDX 글쓰기 섹션을 참고해 Callout이나 PostImage를 사용합니다.
*/}

## 정리

{/*
다시 볼 내용, 남은 질문, 다음 글로 이어질 주제를 적습니다.
필요 없으면 이 섹션은 삭제합니다.
*/}
`

writeFileSync(markdownPath, markdown)

console.log(`Created post: ${markdownPath}`)
console.log(`Created image directory: ${imageDir}`)
console.log(`Created OG image: ${ogImagePath}`)
console.log('')
console.log('Next steps:')
console.log(`1. Put images into: public/images/posts/${slug}/`)
console.log(`2. Or run: npm run blog:image -- --slug ${slug} "/absolute/path/to/image.png"`)
console.log(`3. Start writing in: src/content/posts/${slug}.mdx`)
