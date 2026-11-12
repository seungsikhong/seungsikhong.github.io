import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { copyFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))

const taskConfig = JSON.parse(readFileSync(join(root, '.vscode/tasks.json'), 'utf8'))
const inputTasks = taskConfig.tasks
  .filter((task) => JSON.stringify(task).includes('${input:'))

const createFixture = (t) => {
  const fixture = mkdtempSync(join(tmpdir(), 'blog-input-'))
  t.after(() => rmSync(fixture, { recursive: true, force: true }))
  mkdirSync(join(fixture, 'scripts'))
  mkdirSync(join(fixture, 'src/config'), { recursive: true })
  copyFileSync(join(root, 'scripts/new-post.mjs'), join(fixture, 'scripts/new-post.mjs'))
  writeFileSync(join(fixture, 'src/config/post-categories.json'), JSON.stringify(['AI']))
  writeFileSync(join(fixture, 'src/config/post-tags.json'), '[]')
  writeFileSync(join(fixture, 'src/config/post-collections.json'), JSON.stringify([
    { id: 'ai-basics', label: 'AI Basics', category: 'AI', order: 1 },
  ]))
  symlinkSync(join(root, 'node_modules'), join(fixture, 'node_modules'), 'dir')
  return fixture
}

const expandTaskArgs = (task, fixture, inputs) => task.args.map((arg) => arg
  .replace('${workspaceFolder}', fixture)
  .replace(/\$\{input:(\w+)\}/g, (_, id) => inputs[id]))

test('macOS tasks preserve PATH and can resolve Node through Homebrew-backed shims', { skip: process.platform !== 'darwin' }, () => {
  const inheritedPath = process.env.PATH
  const pathTemplate = taskConfig.osx.options.env.PATH
  assert.equal(pathTemplate, '${env:PATH}:/opt/homebrew/bin:/usr/local/bin')
  const path = pathTemplate.replace('${env:PATH}', inheritedPath)
  const result = spawnSync('node', ['-p', 'JSON.stringify(process.argv.slice(1))', '--', '$HOME', ''], {
    env: { ...process.env, PATH: path }, encoding: 'utf8', timeout: 10_000,
  })
  assert.equal(result.status, 0, result.stderr)
  assert.deepEqual(JSON.parse(result.stdout), ['$HOME', ''])
})

test('VS Code input tasks pass literal arguments without a shell', () => {
  assert.equal(inputTasks.length, 5)
  const value = '한글 "quoted" \'single\' $HOME $(printf expanded) `printf expanded` & | ; \\ path\nsecond line'
  for (const task of inputTasks) {
    assert.equal(task.type, 'process', task.label)
    assert.equal(task.command, 'node', task.label)
    assert.equal(task.options.cwd, '${workspaceFolder}', task.label)
    const ids = [...JSON.stringify(task).matchAll(/\$\{input:(\w+)\}/g)].map((match) => match[1])
    for (const input of [value, '']) {
      const args = expandTaskArgs(task, root, Object.fromEntries(ids.map((id) => [id, input])))
      assert.ok(existsSync(args[0]), args[0])
      assert.equal(args.filter((arg) => arg === input).length, ids.length, task.label)
      const probe = spawnSync(process.execPath, ['-e', 'console.log(JSON.stringify(process.argv.slice(1)))', '--', ...args], { encoding: 'utf8' })
      assert.equal(probe.status, 0, probe.stderr)
      assert.deepEqual(JSON.parse(probe.stdout), args, task.label)
    }
  }
})

test('the new-post task preserves special characters and empty inputs in the generated draft', (t) => {
  const fixture = createFixture(t)
  const task = inputTasks.find((task) => task.label === 'Blog: 새 글 만들기')
  assert.equal(task.type, 'process')
  const title = '입력 "quoted" $HOME $(printf expanded) `printf expanded` & ; \\ path'
  const args = expandTaskArgs(task, fixture, {
    postTitle: title, postExcerpt: '', postCategory: 'AI', postCollection: '',
    postCollectionOrder: '', postTags: '',
  })
  const result = spawnSync(process.execPath, [...args, '--slug', 'ai/task-input'], { cwd: fixture, encoding: 'utf8', timeout: 30_000 })
  assert.equal(result.status, 0, result.stdout + result.stderr)
  const draft = readFileSync(join(fixture, 'src/content/posts/ai/task-input.mdx'), 'utf8')
  assert.equal(JSON.parse(draft.match(/^title: (.+)$/m)[1]), title)
  assert.match(draft, /^excerpt: ""$/m)
  assert.match(draft, /^tags: \[\]$/m)
  assert.doesNotMatch(draft, /^collection:/m)
})

const runInteractive = (fixture, args, steps) => new Promise((resolve, reject) => {
  // Enable the CLI's interactive branch while driving the real readline prompts over pipes.
  const tty = 'Object.defineProperty(process.stdin,"isTTY",{value:true});Object.defineProperty(process.stdout,"isTTY",{value:true});'
  const child = spawn(process.execPath, ['--import', `data:text/javascript,${encodeURIComponent(tty)}`, ...args], {
    cwd: fixture, timeout: 15_000,
  })
  const pending = [...steps]
  let output = ''
  let buffer = ''
  child.on('error', reject)
  child.stdin.on('error', reject)
  child.stderr.on('data', (chunk) => { output += chunk })
  child.stdout.on('data', (chunk) => {
    output += chunk
    buffer += chunk
    if (pending.length && buffer.includes(pending[0][0])) {
      const [prompt, answer] = pending.shift()
      buffer = buffer.slice(buffer.indexOf(prompt) + prompt.length)
      child.stdin.write(`${answer}\n`)
    }
  })
  child.on('close', (status) => resolve({ status, output, pending }))
})

test('collection selection validates both prompted and option input', async (t) => {
  const prompt = 'Collection [0. No collection]: '
  const scenarios = [
    { name: 'prompted typo reuses an existing collection', steps: [[prompt, 'AI Basic'], ['Choose ', '1']], id: 'ai-basics' },
    { name: 'prompted typo adds only after confirmation', steps: [[prompt, 'AI Basic'], ['Choose ', 'new']], id: 'ai-basic', added: true },
    { name: 'cancel leaves the collection registry and posts untouched', steps: [[prompt, 'AI Basic'], ['Choose ', 'c']], status: 1 },
    { name: 'exact label', steps: [[prompt, 'AI Basics']], id: 'ai-basics' },
    { name: 'exact id', steps: [[prompt, 'ai-basics']], id: 'ai-basics' },
    { name: 'numbered selection', steps: [[prompt, '1']], id: 'ai-basics' },
    { name: 'no collection', steps: [[prompt, '0']] },
    { name: 'unrelated new name', steps: [[prompt, 'Robotics Lab']], id: 'robotics-lab', added: true },
    { name: 'option typo uses the same suggestion', option: 'AI Basic', steps: [['Choose ', '1']], id: 'ai-basics' },
    { name: 'non-interactive typo fails without adding', option: 'AI Basic', status: 1 },
  ]
  for (const scenario of scenarios) {
    await t.test(scenario.name, async (t) => {
      const fixture = createFixture(t)
      const registry = join(fixture, 'src/config/post-collections.json')
      const before = readFileSync(registry, 'utf8')
      const args = ['scripts/new-post.mjs', '--title', 'Collection check', '--category', 'AI', '--excerpt', '', '--tags', '', '--slug', 'ai/collection-check']
      if (scenario.option !== undefined) args.push('--collection', scenario.option)
      const result = scenario.steps
        ? await runInteractive(fixture, args, scenario.steps)
        : (() => {
          const child = spawnSync(process.execPath, args, { cwd: fixture, encoding: 'utf8', timeout: 15_000 })
          return { status: child.status, output: child.stdout + child.stderr, pending: [] }
        })()
      assert.deepEqual(result.pending, [], result.output)
      assert.equal(result.status, scenario.status ?? 0, result.output)
      const after = JSON.parse(readFileSync(registry, 'utf8'))
      if (scenario.added) {
        assert.equal(after.length, 2)
        assert.equal(after[1].id, scenario.id)
      } else {
        assert.equal(readFileSync(registry, 'utf8'), before)
      }
      const path = join(fixture, 'src/content/posts/ai/collection-check.mdx')
      if (scenario.status === 1) {
        assert.equal(existsSync(path), false)
        assert.match(result.output, /Canceled collection selection|Similar collections:/)
      } else {
        const draft = readFileSync(path, 'utf8')
        if (scenario.id) assert.ok(draft.includes(`collection: "${scenario.id}"`), draft)
        else assert.doesNotMatch(draft, /^collection:/m)
      }
    })
  }
})

test('drafts can omit an excerpt, but publishing requires one', { timeout: 90_000 }, () => {
  const fixture = mkdtempSync(join(tmpdir(), 'blog-authoring-'))

  try {
    for (const directory of ['src', 'public']) {
      cpSync(join(root, directory), join(fixture, directory), { recursive: true })
    }
    for (const file of ['package.json', 'astro.config.mjs', 'tsconfig.json']) {
      copyFileSync(join(root, file), join(fixture, file))
    }
    mkdirSync(join(fixture, 'scripts'))
    copyFileSync(join(root, 'scripts/new-post.mjs'), join(fixture, 'scripts/new-post.mjs'))
    symlinkSync(join(root, 'node_modules'), join(fixture, 'node_modules'), 'dir')

    const run = (script, args) => spawnSync(process.execPath, [script, ...args], {
      cwd: fixture,
      encoding: 'utf8',
      timeout: 30_000,
      env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
    })
    const createPost = (slug, excerptArgs) => run('scripts/new-post.mjs', [
      '--title', 'Authoring check', '--category', 'Tools & Notes',
      '--slug', slug, '--collection', '', '--tags', '', ...excerptArgs,
    ])
    const created = createPost('tools/wording-check', ['--excerpt', ''])
    assert.equal(created.status, 0, created.stdout + created.stderr)
    const omitted = createPost('tools/no-excerpt', [])
    assert.equal(omitted.status, 0, omitted.stdout + omitted.stderr)

    const postPath = join(fixture, 'src/content/posts/tools/wording-check.mdx')
    const draft = readFileSync(postPath, 'utf8')
    assert.match(draft, /^excerpt: ""$/m)
    assert.match(draft, /^draft: true$/m)
    assert.match(readFileSync(join(fixture, 'src/content/posts/tools/no-excerpt.mdx'), 'utf8'), /^excerpt: ""$/m)
    const og = readFileSync(join(fixture, 'public/og/posts/tools/wording-check.svg'), 'utf8')
    assert.match(og, />Tools &amp; Notes<\/text>/)
    assert.doesNotMatch(og, /개발과 생각의 기록|AI와 구현 경험을 남깁니다/)

    const sync = () => run(join(root, 'node_modules/astro/bin/astro.mjs'), ['sync'])
    const draftResult = sync()
    assert.equal(draftResult.status, 0, draftResult.stdout + draftResult.stderr)

    writeFileSync(postPath, draft.replace('draft: true', 'draft: false'))
    const invalidResult = sync()
    assert.notEqual(invalidResult.status, 0)
    assert.match(invalidResult.stdout + invalidResult.stderr, /게시 전에 excerpt에 글 요약을 입력해 주세요/)

    writeFileSync(postPath, draft
      .replace('draft: true', 'draft: false')
      .replace('excerpt: ""', 'excerpt: "A summary of the authoring check."'))
    const publishedResult = sync()
    assert.equal(publishedResult.status, 0, publishedResult.stdout + publishedResult.stderr)
  } finally {
    rmSync(fixture, { recursive: true, force: true })
  }
})
