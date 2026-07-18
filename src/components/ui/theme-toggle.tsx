import { MonitorCog, MoonStar, SunMedium } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

type ThemePreference = 'system' | 'light' | 'dark'

const THEMES: ThemePreference[] = ['system', 'light', 'dark']
const THEME_LABELS: Record<ThemePreference, string> = {
  system: '시스템',
  light: '라이트',
  dark: '다크',
}

function isThemePreference(value: string | null): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark'
}

function getStoredTheme(): ThemePreference {
  try {
    const saved = localStorage.getItem('site:theme')
    return isThemePreference(saved) ? saved : 'system'
  } catch {
    return 'system'
  }
}

function storeTheme(preference: ThemePreference) {
  try {
    localStorage.setItem('site:theme', preference)
  } catch {}
}

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
    storeTheme(preference)
  }

  window.dispatchEvent(
    new CustomEvent('site-theme-change', {
      detail: { theme: resolved, preference },
    })
  )
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemePreference>('system')

  useEffect(() => {
    const saved = getStoredTheme()
    setTheme(saved)
    applyTheme(saved, false)

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleMediaChange = () => {
      if ((document.documentElement.dataset.themePreference || 'system') === 'system') {
        applyTheme('system', false)
      }
    }

    media.addEventListener('change', handleMediaChange)

    return () => {
      media.removeEventListener('change', handleMediaChange)
    }
  }, [])

  const nextTheme = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length]
  const Icon = theme === 'dark' ? MoonStar : theme === 'light' ? SunMedium : MonitorCog
  const label = THEME_LABELS[theme]
  const nextLabel = THEME_LABELS[nextTheme]
  const ariaLabel = `현재 테마 ${label}, 클릭하면 ${nextLabel}로 전환`

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
