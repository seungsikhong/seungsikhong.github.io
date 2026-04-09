import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { basename, dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const postsDir = join(root, 'src', 'content', 'posts')
const imageRoot = join(root, 'public', 'images', 'posts')

const args = process.argv.slice(2)
const readArg = (name) => {
  const direct = args.find((arg) => arg.startsWith(`${name}=`))
  if (direct) return direct.slice(name.length + 1)
  const index = args.indexOf(name)
  return index >= 0 ? args[index + 1] : undefined
}

const slug = readArg('--slug')
const fileArgs = args.filter((arg, index) => {
  if (arg === '--slug') return false
  if (index > 0 && args[index - 1] === '--slug') return false
  return !arg.startsWith('--slug=')
})

if (!slug || fileArgs.length === 0) {
  console.error('Usage: npm run add-image -- --slug my-post "/absolute/path/to/image.png"')
  process.exit(1)
}

const markdownPath = join(postsDir, `${slug}.md`)
if (!existsSync(markdownPath)) {
  console.error(`Post not found: ${markdownPath}`)
  process.exit(1)
}

const imageDir = join(imageRoot, slug)
mkdirSync(imageDir, { recursive: true })

const slugify = (value) =>
  value
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'image'

const ensureUniqueName = (name) => {
  const ext = extname(name)
  const stem = name.slice(0, -ext.length)
  let candidate = name
  let index = 2

  while (existsSync(join(imageDir, candidate))) {
    candidate = `${stem}-${index}${ext}`
    index += 1
  }

  return candidate
}

const snippets = []

for (const sourcePath of fileArgs) {
  if (!existsSync(sourcePath)) {
    console.error(`Image not found: ${sourcePath}`)
    process.exit(1)
  }

  const ext = extname(sourcePath).toLowerCase() || '.png'
  const base = slugify(basename(sourcePath, ext))
  const fileName = ensureUniqueName(`${base}${ext}`)
  const targetPath = join(imageDir, fileName)

  copyFileSync(sourcePath, targetPath)
  snippets.push(`![Add image description](/images/posts/${slug}/${fileName})`)
}

console.log(`Copied ${snippets.length} image(s) to: ${imageDir}`)
console.log('')
console.log('Markdown:')
console.log(snippets.join('\n\n'))
