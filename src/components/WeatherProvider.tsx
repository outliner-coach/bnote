'use client'

import { useEffect } from 'react'
import { useWeatherStore } from '../store/weatherStore'

interface WeatherProviderProps {
  children: React.ReactNode
}

export function WeatherProvider({ children }: WeatherProviderProps) {
  const initializeFromStorage = useWeatherStore(state => state.initializeFromStorage)

  useEffect(() => {
    // 컴포넌트가 마운트될 때 로컬 스토리지에서 상태 복원
    initializeFromStorage()
  }, [initializeFromStorage])

  return <>{children}</>
} 