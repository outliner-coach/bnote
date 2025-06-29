'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
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

interface NotePageProps {
  params: { id: string }
}

const emptyContent: Descendant[] = [{ type: 'paragraph', children: [{ text: '' }] }]

export default function NotePage({ params }: NotePageProps) {
  const { id } = params
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const [note, setNote] = useState<Note | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    console.log('NotePage useEffect - id:', id, 'isLoaded:', isLoaded, 'isSignedIn:', isSignedIn)
    
    if (isLoaded && !isSignedIn) {
      console.log('User not signed in, redirecting to sign-in')
      router.push('/sign-in')
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
        router.push('/notes')
      }
    }

    if (isSignedIn) {
      console.log('User signed in, loading note')
      loadNote()
    }
  }, [id, isLoaded, isSignedIn, router])

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

  if (!isLoaded || !note) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-transparent">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button
                onClick={handleCancelEdit}
                className="mr-4 p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">노트 수정</h1>
            </div>
          </div>

          {/* 노트 수정 폼 */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden p-6">
            <NoteForm 
              note={note} 
              onSubmit={handleUpdate} 
              onCancel={handleCancelEdit}
              isSubmitting={isUpdating} 
              submitButtonText="수정 완료"
              showCancelButton={true}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
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
  )
}

 