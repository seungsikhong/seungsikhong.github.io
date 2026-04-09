import { MonitorCog, MoonStar, SunMedium } from 'lucide-react'
import { useEffect, useState } from 'react'

import { UI_MESSAGES, type SiteLocale } from '@/config/i18n'
import { Button } from '@/components/ui/button'

type ThemePreference = 'system' | 'light' | 'dark'

const THEMES: ThemePreference[] = ['system', 'light', 'dark']

function resolveTheme(preference: ThemePreference) {
  if (preference !== 'system') return preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(preference: ThemePreference, persist = true) {
  const resolved = resolveTheme(preference)
  const root = document.documentElement

  root.dataset.themePreference = preference
  root.dataset.theme = resolved
  root.style.colorScheme = resolved
  root.classList.toggle('dark', resolved === 'dark')

  if (persist) {
    localStorage.setItem('site:theme', preference)
  }

  window.dispatchEvent(
    new CustomEvent('site-theme-change', {
      detail: { theme: resolved, preference },
    })
  )
}

function getCurrentLocale(): SiteLocale {
  return document.documentElement.dataset.locale === 'ko' ? 'ko' : 'en'
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemePreference>('system')
  const [locale, setLocale] = useState<SiteLocale>('en')

  useEffect(() => {
    const saved = (localStorage.getItem('site:theme') as ThemePreference | null) || 'system'
    setTheme(saved)
    setLocale(getCurrentLocale())
    applyTheme(saved, false)

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleMediaChange = () => {
      if ((document.documentElement.dataset.themePreference || 'system') === 'system') {
        applyTheme('system', false)
      }
    }

    media.addEventListener('change', handleMediaChange)
    const handleLocaleChange = (event: Event) => {
      const nextLocale =
        event instanceof CustomEvent && event.detail?.locale === 'ko' ? 'ko' : getCurrentLocale()
      setLocale(nextLocale)
    }

    window.addEventListener('site-locale-change', handleLocaleChange)

    return () => {
      media.removeEventListener('change', handleMediaChange)
      window.removeEventListener('site-locale-change', handleLocaleChange)
    }
  }, [])

  const nextTheme = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length]
  const Icon = theme === 'dark' ? MoonStar : theme === 'light' ? SunMedium : MonitorCog
  const label =
    theme === 'dark'
      ? UI_MESSAGES[locale].theme_dark
      : theme === 'light'
        ? UI_MESSAGES[locale].theme_light
        : UI_MESSAGES[locale].theme_system
  const nextLabel =
    nextTheme === 'dark'
      ? UI_MESSAGES[locale].theme_dark
      : nextTheme === 'light'
        ? UI_MESSAGES[locale].theme_light
        : UI_MESSAGES[locale].theme_system
  const ariaLabel =
    locale === 'ko'
      ? `현재 테마 ${label}, 클릭하면 ${nextLabel}로 전환`
      : `Current theme ${label}. Click to switch to ${nextLabel}.`

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="h-10 rounded-full border-border/70 bg-background/80 px-3 text-foreground shadow-none backdrop-blur-md"
      onClick={() => {
        setTheme(nextTheme)
        applyTheme(nextTheme)
      }}
      aria-label={ariaLabel}
    >
      <Icon className="size-4" />
      <span>{label}</span>
    </Button>
  )
}
