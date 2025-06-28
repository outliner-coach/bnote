'use client'

import { useWeatherStore } from '@/store/weatherStore'

export default function BackgroundEffect() {
  const { currentWeather } = useWeatherStore()

  const renderWeatherEffect = () => {
    switch (currentWeather) {
      case 'rain':
        return (
          <>
            {Array.from({ length: 30 }, (_, i) => (
              <div
                key={`rain-${i}`}
                className="rain-drop absolute text-blue-400 text-xs pointer-events-none"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random() * 1}s`
                }}
              >
                💧
              </div>
            ))}
          </>
        )

      case 'snow':
        return (
          <>
            {Array.from({ length: 30 }, (_, i) => (
              <div
                key={`snow-${i}`}
                className="snow-flake absolute text-white text-sm pointer-events-none"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 15}s`,
                  fontSize: `${0.8 + Math.random() * 0.4}rem`
                }}
              >
                ❄️
              </div>
            ))}
          </>
        )

      case 'sunny':
        return (
          <div
            className="absolute top-4 right-4 text-4xl pointer-events-none animate-ping"
            style={{ animationDuration: '3s' }}
          >
            ☀️
          </div>
        )

      case 'cloudy':
        return (
          <>
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={`cloud-${i}`}
                className="cloud-float absolute text-gray-400 dark:text-gray-300 text-2xl pointer-events-none"
                style={{
                  top: `${10 + Math.random() * 30}%`,
                  left: `-10%`,
                  animationDelay: `${Math.random() * 8}s`
                }}
              >
                ☁️
              </div>
            ))}
          </>
        )

      case 'night':
        return (
          <>
            {/* Stars */}
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={`star-${i}`}
                className="star-twinkle absolute text-yellow-200 text-xs pointer-events-none"
                style={{
                  top: `${Math.random() * 60}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`
                }}
              >
                ⭐
              </div>
            ))}
            
            {/* Shooting Stars */}
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={`shooting-star-${i}`}
                className="shooting-star absolute text-yellow-300 text-lg pointer-events-none"
                style={{
                  top: `${Math.random() * 40}%`,
                  animationDelay: `${Math.random() * 10 + 5}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              >
                💫
              </div>
            ))}
            
            {/* Moon */}
            <div
              className="moon-glow absolute top-8 right-8 text-3xl pointer-events-none rounded-full"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))'
              }}
            >
              🌙
            </div>
          </>
        )

      default:
        return null
    }
  }

  // 날씨별 배경 그라디언트
  const getBackgroundGradient = () => {
    switch (currentWeather) {
      case 'rain':
        return 'bg-gradient-to-br from-gray-600 via-blue-700 to-gray-800'
      case 'snow':
        return 'bg-gradient-to-br from-gray-200 via-blue-100 to-white dark:from-gray-700 dark:via-gray-600 dark:to-gray-500'
      case 'sunny':
        return 'bg-gradient-to-br from-yellow-200 via-orange-200 to-yellow-300 dark:from-yellow-600 dark:via-orange-600 dark:to-yellow-700'
      case 'cloudy':
        return 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 dark:from-gray-600 dark:via-gray-700 dark:to-gray-800'
      case 'night':
        return 'bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900'
      default:
        return ''
    }
  }

  return (
    <div 
      className={`fixed inset-0 pointer-events-none transition-all duration-1000 ease-in-out ${getBackgroundGradient()}`}
      style={{ 
        zIndex: -1,
        opacity: 0.15
      }}
    >
      {renderWeatherEffect()}
    </div>
  )
} 