import { Descendant } from 'slate';

export interface Note {
  id: string;
  title: string;
  content: Descendant[]; // Slate.js content
  createdAt: string;
  updatedAt: string;
  userId?: string; // 사용자 ID (옵션: 개발 모드 호환성)
  weather?: 'rain' | 'snow' | 'sunny' | 'cloudy' | 'night';
}

export interface CreateNoteRequest {
  title: string;
  content: Descendant[];
  weather?: 'rain' | 'snow' | 'sunny' | 'cloudy' | 'night';
}

export interface UpdateNoteRequest {
  title?: string;
  content?: Descendant[];
  weather?: 'rain' | 'snow' | 'sunny' | 'cloudy' | 'night';
} 