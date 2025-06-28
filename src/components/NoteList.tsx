'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Note } from '@/types';
import { Element, Text } from 'slate';

interface NoteListProps {
  notes: Note[];
  onDelete?: (id: string) => Promise<void>;
}

export function NoteList({ notes, onDelete }: NoteListProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getWeatherIcon = (weather: Note['weather']) => {
    switch (weather) {
      case 'sunny': return '☀️';
      case 'rain': return '🌧️';
      case 'snow': return '❄️';
      case 'cloudy': return '☁️';
      case 'night': return '🌙';
      default: return '☀️';
    }
  };

  const getFirstText = (content: Note['content']) => {
    const firstElement = content[0] as Element;
    const firstChild = firstElement?.children?.[0];
    return Text.isText(firstChild) ? firstChild.text : 'No content';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note) => (
        <div
          key={note.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push(`/notes/${note.id}`)}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
              {note.title || 'Untitled Note'}
            </h3>
            <span className="text-2xl" role="img" aria-label={note.weather}>
              {getWeatherIcon(note.weather)}
            </span>
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {formatDate(note.createdAt)}
          </div>
          
          <div className="text-gray-600 dark:text-gray-300 line-clamp-3">
            {getFirstText(note.content)}
          </div>

          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              className="mt-4 text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
} 