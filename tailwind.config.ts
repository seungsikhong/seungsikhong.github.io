import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // 클래스 기반 다크모드 활성화
  theme: {
    extend: {
      colors: {
        // 커스텀 컬러 팔레트
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      animation: {
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-out-left': 'slideOutLeft 0.3s ease-in',
        'curtain-open-left': 'curtainOpenLeft 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'curtain-open-right': 'curtainOpenRight 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-in-up': 'fadeInUp 1s ease-out 0.8s both',
      },
      keyframes: {
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutLeft: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' },
        },
        curtainOpenLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        curtainOpenRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem', // 사이드바 폭 (352px)
      }
    },
  },
  plugins: [],
}

export default config