'use client';

import React, { useState, useEffect } from 'react';
import { Note } from '@/types';
import Editor from './Editor';
import { WeatherButton } from './WeatherButton';
import { useWeatherStore, type WeatherType } from '../store/weatherStore';
import { Descendant } from 'slate';

interface NoteFormProps {
  note?: Note;
  onSubmit: (data: Partial<Note>) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  showCancelButton?: boolean;
}

export function NoteForm({ 
  note, 
  onSubmit, 
  onCancel,
  isSubmitting = false,
  submitButtonText = '저장',
  showCancelButton = false
}: NoteFormProps) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState<Descendant[]>(note?.content || [{
    type: 'paragraph',
    children: [{ text: '' }]
  }]);
  
  const { currentWeather, setWeather } = useWeatherStore();
  
  // 노트가 있을 때는 노트의 날씨로 설정, 없을 때는 현재 날씨 사용
  useEffect(() => {
    if (note?.weather) {
      setWeather(note.weather as WeatherType);
    }
  }, [note?.weather, setWeather]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title,
      content,
      weather: currentWeather,
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            제목
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white px-3 py-2 transition-colors duration-300"
            placeholder="노트 제목을 입력하세요"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            날씨
          </label>
          <div className="flex items-center">
            <WeatherButton size="lg" showLabel={true} />
            <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
              클릭하여 날씨를 변경하세요
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            내용
          </label>
          <div className="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden bg-white dark:bg-gray-800 transition-colors duration-300">
            <Editor
              value={content}
              onChange={setContent}
              readOnly={false}
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {showCancelButton && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-300"
            >
              취소
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
          >
            {isSubmitting ? '저장 중...' : submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
} 