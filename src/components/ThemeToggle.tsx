'use client'

import { useWeatherStore } from '@/store/weatherStore'

export default function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useWeatherStore()

  return (
    <button
      onClick={toggleDarkMode}
      className="
        p-2 rounded-lg transition-all duration-200
        bg-gray-100 hover:bg-gray-200 
        dark:bg-gray-800 dark:hover:bg-gray-700
        border border-gray-200 dark:border-gray-600
        text-gray-600 dark:text-gray-300
        hover:scale-105 active:scale-95
      "
      aria-label={isDarkMode ? '라이트 모드로 변경' : '다크 모드로 변경'}
      title={isDarkMode ? '라이트 모드로 변경' : '다크 모드로 변경'}
    >
      <span className="text-lg">
        {isDarkMode ? '☀️' : '🌙'}
      </span>
    </button>
  )
} 