// 쿠키 관리 유틸리티 함수들

export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null
  
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

export const setCookie = (name: string, value: string, days: number = 365): void => {
  if (typeof document === 'undefined') return
  
  const expires = new Date()
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

export const deleteCookie = (name: string): void => {
  if (typeof document === 'undefined') return
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

// 블로그 방문 여부 확인
export const hasVisitedBefore = (): boolean => {
  return getCookie('blog_visited') === 'true'
}

// 블로그 방문 기록
export const markAsVisited = (): void => {
  setCookie('blog_visited', 'true', 365) // 1년간 유지
}

// 블로그 방문 기록 삭제 (테스트용)
export const resetVisitHistory = (): void => {
  deleteCookie('blog_visited')
}

// 개발자 테스트를 위한 전역 함수 등록
if (typeof window !== 'undefined') {
  (window as unknown as { resetBlogAnimation: () => void }).resetBlogAnimation = () => {
    resetVisitHistory()
    window.location.reload()
  }
  
  (window as unknown as { checkBlogVisitStatus: () => void }).checkBlogVisitStatus = () => {
    console.log('방문 여부:', hasVisitedBefore())
    console.log('쿠키 값:', getCookie('blog_visited'))
  }
}
