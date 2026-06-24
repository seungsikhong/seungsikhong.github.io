import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const readJson = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'))

const categories = readJson('src/config/post-categories.json')
const rawTags = readJson('src/config/post-tags.json')
const navigation = readJson('src/config/navigation.json')

const tags = rawTags.map((tag) =>
  typeof tag === 'string'
    ? { label: tag, menu: false }
    : { label: tag.label, menu: Boolean(tag.menu) }
)

const printItems = (title, items, emptyText, render = (item) => `- ${item}`) => {
  console.log(title)
  if (items.length === 0) {
    console.log(`- ${emptyText}`)
  } else {
    items.forEach((item) => console.log(render(item)))
  }
  console.log('')
}

const linkItems = navigation.sections.flatMap((section) =>
  section.items
    .filter((item) => item.type === 'link' && item.enabled !== false)
    .map((item) => ({
      section: section.label,
      label: item.label,
      href: item.href,
    }))
)
const generatedItems = navigation.sections.flatMap((section) =>
  section.items
    .filter((item) => item.type !== 'link' && item.enabled !== false)
    .map((item) => ({
      section: section.label,
      type: item.type,
      source: item.source,
      showCounts: item.showCounts,
      includeEmpty: item.includeEmpty,
    }))
)
const menuTags = tags.filter((tag) => tag.menu)
const defaultCategory = categories[0]
const defaultTags = menuTags.map((tag) => tag.label)

console.log('Blog writing settings')
console.log('')

printItems(
  'Link menu',
  linkItems,
  'no link menu items',
  (item) => `- ${item.section}: ${item.label} -> ${item.href}`
)

printItems(
  'Generated menu sections',
  generatedItems,
  'no generated menu sections',
  (item) => {
    const source =
      item.type === 'tags'
        ? item.source === 'all'
          ? 'all registered tags'
          : 'tags with menu=true'
        : item.includeEmpty
          ? 'all registered categories'
          : 'categories with posts'

    return `- ${item.section}: ${source}, counts=${item.showCounts !== false}`
  }
)

printItems('Categories', categories, 'no categories configured')

printItems(
  'Tags',
  tags,
  'no tags configured',
  (tag) => `- ${tag.label}${tag.menu ? ' (menu)' : ''}`
)

console.log('New post example')
if (!defaultCategory) {
  console.log('- Add at least one category before creating a post.')
} else {
  const tagArg = defaultTags.length > 0 ? ` --tags "${defaultTags.join(',')}"` : ''
  console.log(`- npm run blog:new -- --title "글 제목" --category "${defaultCategory}"${tagArg}`)
}
