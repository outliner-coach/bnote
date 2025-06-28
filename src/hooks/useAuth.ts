import { useAuth as useClerkAuth, useUser } from '@clerk/nextjs';
import { useCallback } from 'react';

export function useAuth() {
  const { isLoaded, userId, sessionId } = useClerkAuth();
  const { user, isLoaded: isUserLoaded } = useUser();

  const isAuthenticated = isLoaded && userId !== null;
  const isLoading = !isLoaded || !isUserLoaded;

  const getEmailAddress = useCallback(() => {
    if (!user) return null;
    const primaryEmail = user.emailAddresses.find(
      email => email.id === user.primaryEmailAddressId
    );
    return primaryEmail?.emailAddress || null;
  }, [user]);

  return {
    isAuthenticated,
    isLoading,
    userId,
    sessionId,
    user,
    getEmailAddress
  };
} 