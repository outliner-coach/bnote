/**
 * 시스템 다크 모드 설정 감지
 */
export const detectSystemTheme = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * 시스템 테마 변경 감지 리스너
 */
export const listenForThemeChanges = (callback: (isDark: boolean) => void): (() => void) => {
  if (typeof window === 'undefined') return () => {}
  
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      callback(e.matches)
    }
    
    // 최신 브라우저에서는 addEventListener 사용
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } 
    // 구형 브라우저 지원
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }
  
  return () => {}
}

/**
 * 테마 클래스를 body에 적용/제거
 */
export const applyThemeToDOM = (isDarkMode: boolean) => {
  if (typeof document === 'undefined') return
  
  if (isDarkMode) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

/**
 * 저장된 테마 설정 가져오기
 */
export const getSavedTheme = (): boolean | null => {
  if (typeof localStorage === 'undefined') return null
  
  const saved = localStorage.getItem('darkMode')
  return saved ? JSON.parse(saved) : null
}

/**
 * 테마 설정 저장
 */
export const saveTheme = (isDarkMode: boolean) => {
  if (typeof localStorage === 'undefined') return
  
  localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
} 