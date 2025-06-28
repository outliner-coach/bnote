import { Descendant } from 'slate';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../types';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Fetch all notes
export async function fetchNotes(): Promise<Note[]> {
  const response = await fetch('/api/notes');
  if (!response.ok) {
    throw new Error('Failed to fetch notes');
  }
  return response.json();
}

// Fetch a single note
export async function fetchNote(id: string): Promise<Note> {
  console.log('fetchNote called with id:', id)
  const response = await fetch(`/api/notes/${id}`);
  console.log('fetchNote response status:', response.status)
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error('fetchNote error response:', errorText)
    throw new Error('Failed to fetch note');
  }
  
  const result = await response.json()
  console.log('fetchNote result:', result)
  return result;
}

// Create a new note
export async function createNote(data: CreateNoteRequest): Promise<Note> {
  const response = await fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create note');
  }
  return response.json();
}

// Update a note
export async function updateNote(id: string, data: UpdateNoteRequest): Promise<Note> {
  const response = await fetch(`/api/notes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update note');
  }
  return response.json();
}

// Delete a note
export async function deleteNote(id: string): Promise<void> {
  console.log('deleteNote called with id:', id)
  const response = await fetch(`/api/notes/${id}`, {
    method: 'DELETE',
  });
  console.log('deleteNote response status:', response.status)
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error('deleteNote error response:', errorText)
    throw new Error('Failed to delete note');
  }
  
  console.log('Note deleted successfully')
} 