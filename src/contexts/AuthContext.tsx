'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth as useClerkAuth } from '@clerk/nextjs';
import { LoadingState } from '@/components/LoadingState';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isLoaded, userId } = useClerkAuth();

  if (!isLoaded) {
    return <LoadingState />;
  }

  const auth = {
    isAuthenticated: !!userId,
    isLoading: !isLoaded,
    userId: userId,
  };

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
} 