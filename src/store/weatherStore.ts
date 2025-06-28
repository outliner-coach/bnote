import { create } from 'zustand'

export type WeatherType = 'rain' | 'snow' | 'sunny' | 'cloudy' | 'night'

interface WeatherStore {
  currentWeather: WeatherType
  isDarkMode: boolean
  isAnimating: boolean
  cycleWeather: () => void
  setWeather: (weather: WeatherType) => void
  setAnimating: (isAnimating: boolean) => void
  initializeFromStorage: () => void
}

const weatherCycle: WeatherType[] = ['rain', 'snow', 'sunny', 'cloudy', 'night']

// 날씨별 이모지 매핑
export const weatherEmojis: Record<WeatherType, string> = {
  rain: '🌧️',
  snow: '❄️',
  sunny: '☀️',
  cloudy: '☁️',
  night: '🌙'
}

// 날씨별 색상 테마
export const weatherThemes: Record<WeatherType, { bg: string; accent: string }> = {
  rain: { bg: 'from-gray-600 to-blue-800', accent: 'blue-500' },
  snow: { bg: 'from-blue-200 to-white', accent: 'blue-300' },
  sunny: { bg: 'from-yellow-300 to-orange-400', accent: 'yellow-500' },
  cloudy: { bg: 'from-gray-300 to-gray-500', accent: 'gray-400' },
  night: { bg: 'from-indigo-900 to-black', accent: 'indigo-400' }
}

// DOM에 다크 모드 클래스 적용/제거
const applyThemeToDOM = (isDark: boolean) => {
  if (typeof document !== 'undefined') {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}

export const useWeatherStore = create<WeatherStore>((set, get) => {
  return {
    currentWeather: 'sunny',
    isDarkMode: false,
    isAnimating: false,

    cycleWeather: () => {
      const { currentWeather, setAnimating } = get()
      setAnimating(true)
      
      setTimeout(() => {
        const currentIndex = weatherCycle.indexOf(currentWeather)
        const nextIndex = (currentIndex + 1) % weatherCycle.length
        const nextWeather = weatherCycle[nextIndex]
        
        // 다크 모드는 오직 밤 날씨일 때만 활성화
        const isDark = nextWeather === 'night'
        
        set({ 
          currentWeather: nextWeather,
          isDarkMode: isDark
        })
        
        // DOM에 테마 적용
        applyThemeToDOM(isDark)
        
        // 날씨 상태 저장
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('currentWeather', nextWeather)
        }
        
        setTimeout(() => setAnimating(false), 300)
      }, 150)
    },

    setWeather: (weather) => {
      // 다크 모드는 오직 밤 날씨일 때만 활성화
      const isDark = weather === 'night'
      
      set({ 
        currentWeather: weather,
        isDarkMode: isDark
      })
      
      // DOM에 테마 적용
      applyThemeToDOM(isDark)
      
      // 날씨 상태 저장
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('currentWeather', weather)
      }
    },

    setAnimating: (isAnimating) => {
      set({ isAnimating })
    },

    initializeFromStorage: () => {
      // 저장된 날씨 상태 복원
      if (typeof localStorage !== 'undefined') {
        const savedWeather = localStorage.getItem('currentWeather') as WeatherType
        if (savedWeather && weatherCycle.includes(savedWeather)) {
          const isDark = savedWeather === 'night'
          set({ 
            currentWeather: savedWeather,
            isDarkMode: isDark
          })
          applyThemeToDOM(isDark)
        } else {
          // 기본값 설정
          set({ 
            currentWeather: 'sunny',
            isDarkMode: false
          })
          applyThemeToDOM(false)
        }
      }
    }
  }
}) 