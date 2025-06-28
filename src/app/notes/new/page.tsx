'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { createNote } from '../../../lib/api'
import { NoteForm } from '../../../components/NoteForm'

export default function NewNotePage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 인증 체크
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/')
      return
    }
  }, [isLoaded, isSignedIn, router])

  // 로딩 중이거나 인증되지 않은 경우
  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true)
      setError(null)
      
      const savedNote = await createNote(data)
      router.push(`/notes/${savedNote.id}`)
    } catch (err) {
      console.error('Failed to save note:', err)
      setError('노트를 저장하는데 실패했습니다. 다시 시도해주세요.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link
              href="/notes"
              className="mr-4 p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">새 노트 작성</h1>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-lg">
            <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* 노트 작성 폼 */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden p-6">
          <NoteForm 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting}
            submitButtonText="노트 생성"
          />
        </div>

        {/* 하단 정보 */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>자동 저장 기능이 곧 추가될 예정입니다.</p>
        </div>
      </div>
    </div>
  )
} 