export type ShareChannel = 'copy' | 'x' | 'linkedin' | 'facebook' | 'email'

export const siteMeta = {
  name: 'SeungSik Hong',
  title: 'SeungSik Hong',
  description: '물류 시스템 개발자가 AI, 개발 도구, 구현 과정에서 얻은 판단과 기록을 정리하는 개인 기술 블로그입니다.',
  url: 'https://seungsikhong.github.io',
  author: 'SeungSik Hong',
  authorUrl: 'https://seungsikhong.github.io/about/',
  locale: 'ko_KR',
  twitterCard: 'summary_large_image' as const,
  ogImage: '/og-default.png',
  ogImageAlt: 'SeungSik Hong 기술 블로그',
}

export const commentConfig = {
  provider: 'giscus' as const,
  repo: 'seungsikhong/seungsikhong.github.io',
  repoId: 'R_kgDOPFBrlA',
  category: 'Comments',
  categoryId: 'DIC_kwDOPFBrlM4C6g5k',
  mapping: 'pathname',
  strict: '0',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'bottom',
  lang: 'ko',
  lightTheme: 'light',
  darkTheme: 'dark_dimmed',
}

export const analyticsConfig = {
  provider: 'goatcounter' as const,
  site: 'https://seungsikhong.goatcounter.com',
}

export const viewCounterConfig = {
  provider: 'cloudflare-d1' as const,
  endpoint: import.meta.env.PUBLIC_VIEW_COUNTER_ENDPOINT?.replace(/\/+$/, '') ?? '',
}

export const shareConfig = {
  copy: true,
  x: true,
  linkedin: true,
  facebook: true,
  email: true,
} as const satisfies Record<ShareChannel, boolean>

export function getEnabledShareChannels() {
  return Object.entries(shareConfig)
    .filter(([, enabled]) => enabled)
    .map(([channel]) => channel as ShareChannel)
}

export function hasCommentProviderConfig() {
  return Boolean(
    commentConfig.repo &&
      commentConfig.repoId &&
      commentConfig.category &&
      commentConfig.categoryId
  )
}

export function hasAnalyticsProviderConfig() {
  return Boolean(analyticsConfig.site)
}

export function getAnalyticsSiteBase() {
  if (!analyticsConfig.site) return ''
  return analyticsConfig.site.replace(/\/+$/, '')
}

export function getAnalyticsCountEndpoint() {
  const base = getAnalyticsSiteBase()
  return base ? `${base}/count` : ''
}

export function hasViewCounterConfig() {
  return Boolean(viewCounterConfig.endpoint)
}

export function getViewCounterEndpoint() {
  return viewCounterConfig.endpoint
}
