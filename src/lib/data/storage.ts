import fs from 'fs';
import path from 'path';
import { Note } from '../../types';

const DATA_DIR = path.join(process.cwd(), 'data');
const NOTES_FILE = path.join(DATA_DIR, 'notes.json');

// 데이터 디렉토리가 없으면 생성
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// 노트 파일이 없으면 빈 배열로 초기화
function ensureNotesFile() {
  ensureDataDir();
  if (!fs.existsSync(NOTES_FILE)) {
    fs.writeFileSync(NOTES_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

// 모든 노트 읽기 (사용자별 필터링 옵션)
export function getAllNotes(userId?: string): Note[] {
  try {
    ensureNotesFile();
    const data = fs.readFileSync(NOTES_FILE, 'utf8');
    const allNotes = JSON.parse(data);
    
    // userId가 제공되면 해당 사용자의 노트만 반환
    if (userId) {
      return allNotes.filter((note: Note) => note.userId === userId);
    }
    
    // 개발 모드: userId가 없는 노트들만 반환 (기존 호환성)
    return allNotes.filter((note: Note) => !note.userId);
  } catch (error) {
    console.error('Error reading notes:', error);
    return [];
  }
}

// ID로 노트 찾기 (사용자별 필터링)
export function getNoteById(id: string, userId?: string): Note | null {
  const notes = getAllNotes(userId);
  return notes.find(note => note.id === id) || null;
}

// 새 노트 저장
export function saveNote(note: Note): Note {
  try {
    ensureNotesFile();
    const data = fs.readFileSync(NOTES_FILE, 'utf8');
    const notes = JSON.parse(data);
    
    const existingIndex = notes.findIndex((n: Note) => n.id === note.id);
    
    if (existingIndex >= 0) {
      // 기존 노트 업데이트
      notes[existingIndex] = note;
    } else {
      // 새 노트 추가
      notes.push(note);
    }
    
    fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2), 'utf8');
    return note;
  } catch (error) {
    console.error('Error saving note:', error);
    throw error;
  }
}

// 노트 삭제 (사용자별 검증)
export function deleteNote(id: string, userId?: string): boolean {
  try {
    ensureNotesFile();
    const data = fs.readFileSync(NOTES_FILE, 'utf8');
    const notes = JSON.parse(data);
    
    const noteIndex = notes.findIndex((note: Note) => {
      if (userId) {
        // 사용자 ID가 있으면 본인 노트만 삭제 가능
        return note.id === id && note.userId === userId;
      } else {
        // 개발 모드: userId가 없는 노트만 삭제 가능
        return note.id === id && !note.userId;
      }
    });
    
    if (noteIndex === -1) {
      return false; // 노트를 찾을 수 없거나 권한 없음
    }
    
    notes.splice(noteIndex, 1);
    fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error deleting note:', error);
    return false;
  }
}

// 랜덤 ID 생성
export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 5);
} 