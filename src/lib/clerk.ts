import { auth as serverAuth, currentUser } from '@clerk/nextjs/server';
import { useAuth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

/**
 * Server-side authentication utilities for B Note
 */

export async function requireAuth() {
  const { userId } = await serverAuth();
  if (!userId) {
    redirect('/sign-in?redirect_url=' + encodeURIComponent(window.location.pathname));
  }
  return userId;
}

export async function getUser() {
  const user = await currentUser();
  return user;
}

/**
 * Client-side hooks for authentication state
 */
export function useRequireAuth() {
  const { userId } = useAuth();
  if (!userId) {
    redirect('/sign-in');
  }
  return userId;
}

/**
 * Type definitions for Clerk session data
 */
export interface ClerkSession {
  userId: string | null;
  sessionId: string | null;
  status: 'authenticated' | 'unauthenticated';
}

export interface ClerkUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  emailAddresses: Array<{
    id: string;
    emailAddress: string;
    verification: {
      status: 'verified' | 'unverified';
    };
  }>;
  primaryEmailAddressId: string | null;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
} 