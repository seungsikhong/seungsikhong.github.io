const DEFAULT_DEDUPE_SECONDS = 60 * 60
const MAX_PATHS_PER_REQUEST = 50
const POST_PATH_PATTERN = /^\/posts\/[A-Za-z0-9][A-Za-z0-9/_-]*\/$/

const json = (data, init = {}) =>
  new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...(init.headers ?? {}),
    },
  })

const getAllowedOrigins = (env) =>
  String(env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

const getCorsHeaders = (request, env) => {
  const origin = request.headers.get('origin') ?? ''
  const allowed = getAllowedOrigins(env)
  const allowOrigin = allowed.includes(origin) ? origin : ''

  return {
    ...(allowOrigin ? { 'access-control-allow-origin': allowOrigin } : {}),
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'content-type',
    'vary': 'Origin',
  }
}

const isAllowedOrigin = (request, env) => {
  const origin = request.headers.get('origin')
  if (!origin) return false
  return getAllowedOrigins(env).includes(origin)
}

const normalizePath = (path) => {
  if (typeof path !== 'string') return ''
  const trimmed = path.trim()
  if (!trimmed.startsWith('/posts/')) return ''
  const normalized = trimmed.endsWith('/') ? trimmed : `${trimmed}/`
  return POST_PATH_PATTERN.test(normalized) ? normalized : ''
}

const getAllowedPostPaths = (env) =>
  new Set(
    String(env.ALLOWED_POST_PATHS ?? '')
      .split(',')
      .map(normalizePath)
      .filter(Boolean)
  )

const isAllowedPostPath = (env, path) => {
  const allowedPostPaths = getAllowedPostPaths(env)
  return allowedPostPaths.size === 0 || allowedPostPaths.has(path)
}

const getRequestedPaths = (url) => {
  const paths = [
    ...url.searchParams.getAll('path'),
    ...url.searchParams
      .getAll('paths')
      .flatMap((value) => value.split(','))
      .map((value) => value.trim()),
  ]

  return [...new Set(paths.map(normalizePath).filter(Boolean))].slice(0, MAX_PATHS_PER_REQUEST)
}

const getClientIp = (request) =>
  request.headers.get('cf-connecting-ip') ||
  request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
  '0.0.0.0'

const getDedupeSeconds = (env) => {
  const parsed = Number(env.VIEW_DEDUPE_SECONDS)
  return Number.isFinite(parsed) && parsed >= 60 ? Math.floor(parsed) : DEFAULT_DEDUPE_SECONDS
}

const toHex = (buffer) =>
  [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('')

const createVisitorHash = async (request, env, path, bucket) => {
  const salt = env.VIEW_COUNTER_SALT
  if (!salt) {
    throw new Error('Missing VIEW_COUNTER_SALT secret.')
  }

  const ip = getClientIp(request)
  const userAgent = request.headers.get('user-agent') ?? 'unknown'
  const payload = `${salt}:${ip}:${userAgent}:${path}:${bucket}`
  const encoded = new TextEncoder().encode(payload)
  const digest = await crypto.subtle.digest('SHA-256', encoded)
  return toHex(digest)
}

const readViews = async (env, paths) => {
  if (paths.length === 0) return {}

  const placeholders = paths.map(() => '?').join(',')
  const { results } = await env.DB.prepare(
    `SELECT path, views FROM post_views WHERE path IN (${placeholders})`
  )
    .bind(...paths)
    .all()

  const counts = Object.fromEntries(paths.map((path) => [path, 0]))
  for (const row of results ?? []) {
    counts[row.path] = Number(row.views) || 0
  }

  return counts
}

const incrementView = async (request, env, path) => {
  const now = Date.now()
  const nowIso = new Date(now).toISOString()
  const dedupeSeconds = getDedupeSeconds(env)
  const bucket = Math.floor(now / (dedupeSeconds * 1000))
  const expiresAt = Math.floor(now / 1000) + dedupeSeconds
  const visitorHash = await createVisitorHash(request, env, path, bucket)

  const inserted = await env.DB.prepare(
    `INSERT OR IGNORE INTO post_view_events (path, visitor_hash, viewed_at, expires_at)
     VALUES (?, ?, ?, ?)`
  )
    .bind(path, visitorHash, nowIso, expiresAt)
    .run()

  const counted = (inserted.meta?.changes ?? 0) > 0

  if (counted) {
    await env.DB.prepare(
      `INSERT INTO post_views (path, views, updated_at)
       VALUES (?, 1, ?)
       ON CONFLICT(path) DO UPDATE SET
         views = post_views.views + 1,
         updated_at = excluded.updated_at`
    )
      .bind(path, nowIso)
      .run()
  } else {
    await env.DB.prepare(
      `INSERT OR IGNORE INTO post_views (path, views, updated_at)
       VALUES (?, 0, ?)`
    )
      .bind(path, nowIso)
      .run()
  }

  const row = await env.DB.prepare('SELECT views FROM post_views WHERE path = ?').bind(path).first()

  if (Math.random() < 0.02) {
    try {
      await env.DB.prepare('DELETE FROM post_view_events WHERE expires_at < ?')
        .bind(Math.floor(now / 1000))
        .run()
    } catch {}
  }

  return {
    counted,
    views: Number(row?.views) || 0,
  }
}

const handleGetViews = async (request, env) => {
  const url = new URL(request.url)
  const paths = getRequestedPaths(url)
  const allowedPaths = paths.filter((path) => isAllowedPostPath(env, path))
  const counts = await readViews(env, allowedPaths)
  return json({ counts }, { headers: getCorsHeaders(request, env) })
}

const handlePostViews = async (request, env) => {
  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid JSON body.' }, { status: 400, headers: getCorsHeaders(request, env) })
  }

  const path = normalizePath(body?.path)
  if (!path) {
    return json({ error: 'Invalid post path.' }, { status: 400, headers: getCorsHeaders(request, env) })
  }

  if (!isAllowedPostPath(env, path)) {
    return json({ error: 'Post path is not allowed.' }, { status: 404, headers: getCorsHeaders(request, env) })
  }

  try {
    const result = await incrementView(request, env, path)
    return json({ path, ...result }, { headers: getCorsHeaders(request, env) })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not increment views.'
    return json({ error: message }, { status: 500, headers: getCorsHeaders(request, env) })
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const corsHeaders = getCorsHeaders(request, env)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders })
    }

    if (url.pathname === '/health') {
      return json({ ok: true }, { headers: corsHeaders })
    }

    if (url.pathname !== '/views') {
      return json({ error: 'Not found.' }, { status: 404, headers: corsHeaders })
    }

    if (!isAllowedOrigin(request, env)) {
      return json({ error: 'Origin is not allowed.' }, { status: 403, headers: corsHeaders })
    }

    if (request.method === 'GET') {
      return handleGetViews(request, env)
    }

    if (request.method === 'POST') {
      return handlePostViews(request, env)
    }

    return json({ error: 'Method not allowed.' }, { status: 405, headers: corsHeaders })
  },
}
