import React from 'react';
import { SignInButton } from '@clerk/nextjs';

export function SessionExpired() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Session Expired</h2>
        <p className="text-gray-600 mb-6">
          Your session has expired. Please sign in again to continue.
        </p>
        <div className="flex justify-end">
          <SignInButton mode="modal">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
              Sign In
            </button>
          </SignInButton>
        </div>
      </div>
    </div>
  );
} 