import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const categoriesPath = join(root, 'src', 'config', 'post-categories.json')
const tagsPath = join(root, 'src', 'config', 'post-tags.json')
const isInteractive = Boolean(input.isTTY && output.isTTY)
let promptInterface

const args = process.argv.slice(2)
const typeAliases = new Map([
  ['category', 'category'],
  ['categories', 'category'],
  ['tag', 'tag'],
  ['tags', 'tag'],
])

const readArg = (name) => {
  const direct = args.find((arg) => arg.startsWith(`${name}=`))
  if (direct) return direct.slice(name.length + 1)

  const index = args.indexOf(name)
  if (index < 0) return undefined

  const next = args[index + 1]
  return next && !next.startsWith('--') ? next : ''
}

const getPositionalArgs = () => {
  const positional = []
  const rawType = readArg('--type') ?? (args[0]?.startsWith('-') ? undefined : args[0])
  const optionsWithValue = new Set(['--name', '--menu', '--type'])

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]
    if (arg === rawType) continue

    if (arg.startsWith('--')) {
      const option = arg.split('=')[0]
      if (!arg.includes('=') && optionsWithValue.has(option)) {
        const next = args[index + 1]
        if (next && !next.startsWith('--')) index += 1
      }
      continue
    }

    positional.push(arg)
  }

  return positional
}

const printUsage = () => {
  console.log('Usage:')
  console.log('  npm run blog:category:add')
  console.log('  npm run blog:category:add -- --name "AI"')
  console.log('  npm run blog:tag:add')
  console.log('  npm run blog:tag:add -- --name "인공신경망" --menu false')
  console.log('  npm run blog:tag:add -- --name "AI" --menu true')
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

const readJson = (path) => {
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch (error) {
    fail(`Could not read JSON: ${path}`, [error instanceof Error ? error.message : String(error)])
  }
}

const writeJson = (path, value) => {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`)
}

const normalizeName = (value) => value.trim().replace(/\s+/g, ' ')
const normalizeKey = (value) => normalizeName(value).toLowerCase()

const parseBoolean = (value, fallback = false) => {
  if (value === undefined) return fallback
  if (value === '') return true

  const normalized = value.trim().toLowerCase()
  if (['1', 'true', 't', 'yes', 'y', 'on'].includes(normalized)) return true
  if (['0', 'false', 'f', 'no', 'n', 'off'].includes(normalized)) return false

  fail(`Invalid boolean value: ${value}`, ['Use true or false.'])
}

const normalizeTagConfig = (tag) => {
  if (typeof tag === 'string') return { label: normalizeName(tag), menu: undefined }
  if (tag && typeof tag === 'object') {
    return {
      label: normalizeName(String(tag.label ?? '')),
      menu: tag.menu === undefined ? undefined : Boolean(tag.menu),
    }
  }

  return { label: '', menu: undefined }
}

const ensureValidCategories = (categories) => {
  if (
    !Array.isArray(categories) ||
    categories.some((category) => typeof category !== 'string' || !category.trim())
  ) {
    fail(`Invalid categories file: ${categoriesPath}`)
  }
}

const ensureValidTags = (tags) => {
  if (!Array.isArray(tags) || tags.some((tag) => !normalizeTagConfig(tag).label)) {
    fail(`Invalid tags file: ${tagsPath}`)
  }
}

const resolveType = () => {
  const rawType = readArg('--type') ?? (args[0]?.startsWith('-') ? undefined : args[0])
  const type = rawType ? typeAliases.get(rawType.toLowerCase()) : undefined

  if (!type) {
    printUsage()
    process.exit(rawType ? 1 : 0)
  }

  return type
}

const resolveName = async (type) => {
  const positionalName = getPositionalArgs()[0]
  const providedName = readArg('--name') || positionalName
  if (providedName) return normalizeName(providedName)

  if (!isInteractive) {
    fail(`Name is required.`, [`Use: npm run blog:${type}:add -- --name "Name"`])
  }

  const answer = await ask(`${type === 'category' ? 'Category' : 'Tag'} name: `)
  if (!answer) fail('Name is required.')
  return normalizeName(answer)
}

const resolveMenu = async () => {
  const providedMenu = readArg('--menu')
  if (providedMenu !== undefined) return parseBoolean(providedMenu)

  if (!isInteractive) return false

  const answer = await ask('Show this tag in the navigation menu? [y/N]: ')
  return answer ? parseBoolean(answer) : false
}

const addCategory = async () => {
  const categories = readJson(categoriesPath)
  ensureValidCategories(categories)

  const name = await resolveName('category')
  if (!name) fail('Category name is required.')

  const existing = categories.find((category) => normalizeKey(category) === normalizeKey(name))
  if (existing) {
    console.log(`Category already exists: ${existing}`)
    return
  }

  categories.push(name)
  writeJson(categoriesPath, categories)
  console.log(`Added category: ${name}`)
}

const addTag = async () => {
  const rawTags = readJson(tagsPath)
  ensureValidTags(rawTags)

  const name = await resolveName('tag')
  if (!name) fail('Tag name is required.')

  const menu = await resolveMenu()
  const existingIndex = rawTags.findIndex((tag) => normalizeKey(normalizeTagConfig(tag).label) === normalizeKey(name))

  if (existingIndex >= 0) {
    const existing = normalizeTagConfig(rawTags[existingIndex])
    rawTags[existingIndex] = { label: existing.label, menu }
    writeJson(tagsPath, rawTags)
    console.log(`Updated tag: ${existing.label} (menu=${menu})`)
    return
  }

  rawTags.push({ label: name, menu })
  writeJson(tagsPath, rawTags)
  console.log(`Added tag: ${name} (menu=${menu})`)
}

if (args.includes('--help') || args.includes('-h')) {
  printUsage()
  process.exit(0)
}

const type = resolveType()

if (type === 'category') {
  await addCategory()
} else {
  await addTag()
}

closePrompt()
