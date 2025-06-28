'use client'

import { useWeatherStore, weatherEmojis, weatherThemes, type WeatherType } from '../store/weatherStore'

interface WeatherButtonProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const sizeClasses = {
  sm: 'w-8 h-8 text-lg',
  md: 'w-12 h-12 text-2xl',
  lg: 'w-16 h-16 text-3xl'
}

const weatherLabels: Record<WeatherType, string> = {
  rain: '비',
  snow: '눈',
  sunny: '맑음',
  cloudy: '구름',
  night: '달밤'
}

export function WeatherButton({ 
  className = '', 
  size = 'md', 
  showLabel = true 
}: WeatherButtonProps) {
  const { currentWeather, isAnimating, cycleWeather } = useWeatherStore()
  const theme = weatherThemes[currentWeather]

  const handleClick = () => {
    if (!isAnimating) {
      cycleWeather()
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handleClick}
        disabled={isAnimating}
        className={`
          ${sizeClasses[size]}
          relative
          rounded-full
          bg-gradient-to-br ${theme.bg}
          shadow-lg
          hover:shadow-xl
          transition-all
          duration-300
          transform
          hover:scale-105
          active:scale-95
          disabled:opacity-70
          disabled:cursor-not-allowed
          flex
          items-center
          justify-center
          border-2
          border-white/20
          backdrop-blur-sm
          ${isAnimating ? 'animate-pulse' : ''}
        `}
        title={`현재: ${weatherLabels[currentWeather]} (클릭하여 변경)`}
      >
        <span 
          className={`
            transition-all 
            duration-300 
            ${isAnimating ? 'scale-0 rotate-180' : 'scale-100 rotate-0'}
          `}
        >
          {weatherEmojis[currentWeather]}
        </span>
        
        {/* 로딩 애니메이션 */}
        {isAnimating && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </button>
      
      {showLabel && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
          {weatherLabels[currentWeather]}
        </span>
      )}
    </div>
  )
} 