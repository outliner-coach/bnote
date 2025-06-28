'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { PlusIcon } from '@heroicons/react/24/outline'
import { fetchNotes } from '../../lib/api'
import { Note } from '../../types'

export default function NotesPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
      return
    }

    const loadNotes = async () => {
      try {
        console.log('Loading notes...')
        const fetchedNotes = await fetchNotes()
        console.log('Notes loaded:', fetchedNotes)
        setNotes(fetchedNotes)
      } catch (error) {
        console.error('Failed to load notes:', error)
        setError('Failed to load notes. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    if (isSignedIn) {
      loadNotes()
    }
  }, [isLoaded, isSignedIn, router])

  const handleCreateNote = () => {
    router.push('/notes/new')
  }

  const handleDelete = (id: string) => {
    // Implement the delete logic here
    console.log('Deleting note with ID:', id)
  }

  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="bnote-container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">내 노트</h1>
          <Link
            href="/notes/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            새 노트 작성
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-lg">
            <p className="text-red-600 dark:text-red-300">{error}</p>
          </div>
        )}

        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden">
          {notes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">아직 노트가 없습니다.</p>
              <button
                onClick={handleCreateNote}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                첫 노트 작성하기
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => {
                console.log('Rendering note:', { id: note.id, title: note.title })
                return (
                  <Link
                    key={note.id}
                    href={`/notes/${note.id}`}
                    className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                    onClick={() => console.log('Clicked note with ID:', note.id)}
                  >
                    <h2 className="text-xl font-semibold mb-2 truncate">{note.title}</h2>
                    <div className="flex items-center justify-between text-gray-600 text-sm">
                      <span>
                        {new Date(note.updatedAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      {note.weather && (
                        <span className="text-lg">
                          {note.weather === 'sunny' && '☀️'}
                          {note.weather === 'cloudy' && '☁️'}
                          {note.weather === 'rain' && '🌧️'}
                          {note.weather === 'snow' && '❄️'}
                          {note.weather === 'night' && '🌙'}
                        </span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 