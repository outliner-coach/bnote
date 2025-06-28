import { create } from 'zustand'

export interface NavigationState {
  // 사이드바 상태
  isSidebarOpen: boolean
  
  // 현재 편집 중인 노트
  currentNoteId: string | null
  
  // 툴바 상태
  activeFormatButtons: {
    bold: boolean
    italic: boolean
    underline: boolean
    strikethrough: boolean
  }
  
  // 자동 저장 상태
  autoSaveStatus: 'idle' | 'saving' | 'saved' | 'error'
  lastSaved: Date | null
  
  // 검색 상태
  searchQuery: string
  isSearchFocused: boolean
}

export interface NavigationActions {
  // 사이드바 액션
  toggleSidebar: () => void
  openSidebar: () => void
  closeSidebar: () => void
  
  // 노트 관리
  setCurrentNote: (noteId: string | null) => void
  
  // 툴바 액션
  toggleFormatButton: (format: keyof NavigationState['activeFormatButtons']) => void
  resetFormatButtons: () => void
  
  // 자동 저장 액션
  setAutoSaveStatus: (status: NavigationState['autoSaveStatus']) => void
  updateLastSaved: () => void
  
  // 검색 액션
  setSearchQuery: (query: string) => void
  setSearchFocus: (focused: boolean) => void
  clearSearch: () => void
}

export type NavigationStore = NavigationState & NavigationActions

export const useNavigationStore = create<NavigationStore>((set, get) => ({
  // 초기 상태
  isSidebarOpen: false,
  currentNoteId: null,
  activeFormatButtons: {
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false
  },
  autoSaveStatus: 'idle',
  lastSaved: null,
  searchQuery: '',
  isSearchFocused: false,

  // 사이드바 액션
  toggleSidebar: () => set((state) => ({ 
    isSidebarOpen: !state.isSidebarOpen 
  })),
  
  openSidebar: () => set({ isSidebarOpen: true }),
  
  closeSidebar: () => set({ isSidebarOpen: false }),

  // 노트 관리
  setCurrentNote: (noteId) => set({ currentNoteId: noteId }),

  // 툴바 액션
  toggleFormatButton: (format) => set((state) => ({
    activeFormatButtons: {
      ...state.activeFormatButtons,
      [format]: !state.activeFormatButtons[format]
    }
  })),
  
  resetFormatButtons: () => set({
    activeFormatButtons: {
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false
    }
  }),

  // 자동 저장 액션
  setAutoSaveStatus: (status) => set({ autoSaveStatus: status }),
  
  updateLastSaved: () => set({ 
    lastSaved: new Date(),
    autoSaveStatus: 'saved'
  }),

  // 검색 액션
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setSearchFocus: (focused) => set({ isSearchFocused: focused }),
  
  clearSearch: () => set({ 
    searchQuery: '', 
    isSearchFocused: false 
  })
}))

// 유틸리티 훅들
export const useIsSidebarOpen = () => useNavigationStore((state) => state.isSidebarOpen)
export const useCurrentNoteId = () => useNavigationStore((state) => state.currentNoteId)
export const useAutoSaveStatus = () => useNavigationStore((state) => state.autoSaveStatus)
export const useSearchQuery = () => useNavigationStore((state) => state.searchQuery) 