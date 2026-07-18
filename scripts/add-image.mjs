import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { basename, dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

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
  console.error('Usage: npm run blog:image -- --slug my-post "/absolute/path/to/image.png"')
  process.exit(1)
}

const markdownCandidates = [
  join(postsDir, `${slug}.mdx`),
  join(postsDir, `${slug}.md`),
]
const markdownPath = markdownCandidates.find((path) => existsSync(path))
if (!markdownPath) {
  console.error(`Post not found: ${markdownCandidates[0]}`)
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

const readImageSizeWithSharp = async (sourcePath) => {
  try {
    const { default: sharp } = await import('sharp')
    const metadata = await sharp(sourcePath).metadata()
    if (metadata.width && metadata.height) {
      return { width: metadata.width, height: metadata.height }
    }
  } catch {}

  return null
}

const readImageSizeWithSips = (sourcePath) => {
  try {
    const output = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', sourcePath], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    })
    const width = Number(output.match(/pixelWidth:\s*(\d+)/)?.[1])
    const height = Number(output.match(/pixelHeight:\s*(\d+)/)?.[1])
    if (Number.isFinite(width) && Number.isFinite(height)) {
      return { width, height }
    }
  } catch {}

  return null
}

const readImageSize = async (sourcePath) =>
  (await readImageSizeWithSharp(sourcePath)) || readImageSizeWithSips(sourcePath)

const buildPostImageSnippet = ({ src, width, height }) => {
  const dimensionLines =
    width && height
      ? `\n  width={${width}}\n  height={${height}}`
      : ''

  return `<PostImage
  src="${src}"
  alt="이미지 설명"
  caption="선택 캡션"
  size="wide"${dimensionLines}
/>`
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
  const dimensions = await readImageSize(targetPath)
  snippets.push(
    buildPostImageSnippet({
      src: `/images/posts/${slug}/${fileName}`,
      width: dimensions?.width,
      height: dimensions?.height,
    })
  )
}

console.log(`Copied ${snippets.length} image(s) to: ${imageDir}`)
console.log('')
console.log('MDX:')
console.log(snippets.join('\n\n'))
