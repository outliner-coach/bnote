'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon
} from '@heroicons/react/24/outline'
import Editor from '../../../components/Editor'
import { NoteForm } from '../../../components/NoteForm'
import { fetchNote, updateNote, deleteNote as deleteNoteApi } from '../../../lib/api'
import { Note } from '../../../types'
import { Descendant } from 'slate'
import { LoadingState } from '@/components/LoadingState'
import { SessionExpired } from '@/components/SessionExpired'
import BackgroundEffect from '@/components/BackgroundEffect'

interface NotePageProps {
  params: Promise<{ id: string }>
}

const emptyContent: Descendant[] = [{ type: 'paragraph', children: [{ text: '' }] }]

export default function NotePage({ params }: NotePageProps) {
  const { isLoaded, userId } = useAuth()
  const router = useRouter()
  const [note, setNote] = useState<Note | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [id, setId] = useState<string | null>(null)

  // Resolve params Promise
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params
      setId(resolvedParams.id)
    }
    resolveParams()
  }, [params])

  useEffect(() => {
    if (!isLoaded || !id) return

    if (!userId) {
      router.push('/')
      return
    }

    const loadNote = async () => {
      try {
        console.log('Loading note with id:', id)
        const noteData = await fetchNote(id)
        console.log('Note loaded successfully:', noteData)
        setNote(noteData)
      } catch (error) {
        console.error('노트를 불러오는데 실패했습니다:', error)
        setError('Failed to load note')
      } finally {
        setLoading(false)
      }
    }

    loadNote()
  }, [id, isLoaded, userId, router])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleUpdate = async (data: Partial<Note>) => {
    if (!note) return

    try {
      setIsUpdating(true)
      const updatedNote = await updateNote(note.id, {
        title: data.title,
        content: data.content,
        weather: data.weather
      })
      setNote(updatedNote)
      setIsEditing(false)
    } catch (error) {
      console.error('노트 업데이트에 실패했습니다:', error)
      alert('노트 업데이트에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!note || isDeleting) return

    if (!confirm('정말로 이 노트를 삭제하시겠습니까?')) {
      return
    }

    console.log('Starting delete process for note:', note.id)
    setIsDeleting(true)
    try {
      await deleteNoteApi(note.id)
      console.log('Delete successful, redirecting to notes list')
      router.push('/notes')
    } catch (error) {
      console.error('노트 삭제에 실패했습니다:', error)
      alert('노트 삭제에 실패했습니다. 다시 시도해주세요.')
      setIsDeleting(false)
    }
  }

  if (!isLoaded || loading) {
    return <LoadingState />
  }

  if (!userId) {
    return <SessionExpired />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/notes')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Notes
          </button>
        </div>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Note not found</p>
          <button
            onClick={() => router.push('/notes')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Notes
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <BackgroundEffect />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/notes"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            뒤로 가기
          </Link>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleEdit}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              수정
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50"
            >
              <TrashIcon className="h-5 w-5 mr-2" />
              {isDeleting ? '삭제 중...' : '삭제'}
            </button>
          </div>
        </div>

        {/* 제목 */}
        <h1 className="text-3xl font-bold mb-8">{note.title}</h1>

        {/* 날씨 표시 */}
        {note.weather && (
          <div className="mb-8">
            <span className="text-2xl">
              {note.weather === 'sunny' && '☀️'}
              {note.weather === 'cloudy' && '☁️'}
              {note.weather === 'rain' && '🌧️'}
              {note.weather === 'snow' && '❄️'}
              {note.weather === 'night' && '🌙'}
            </span>
          </div>
        )}

        {/* 에디터 (읽기 전용) */}
        <Editor
          value={note.content}
          onChange={() => {}}
          readOnly={true}
        />
      </div>
    </>
  )
}

 