import type { Metadata } from 'next'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { AuthProvider } from '@/contexts/AuthContext'
import { WeatherProvider } from '@/components/WeatherProvider'
import BackgroundEffect from '@/components/BackgroundEffect'
import { WeatherButton } from '@/components/WeatherButton'
import './globals.css'

export const metadata: Metadata = {
  title: 'B Note - 스마트 노트 앱',
  description: 'iOS 애플 메모장과 유사한 스타일·서식 편집 기능을 가진 모바일 웹앱',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  
  if (!publishableKey) {
    throw new Error('Missing Publishable Key')
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <html lang="ko">
        <body>
          <WeatherProvider>
            <BackgroundEffect />
            <AuthProvider>
              <div className="min-h-screen">
                {/* Header */}
                <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
                  <div className="bnote-container py-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                          B Note
                        </h1>
                        <WeatherButton size="sm" />
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <SignedOut>
                          <div className="flex gap-2">
                            <SignInButton>
                              <button className="px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors">
                                로그인
                              </button>
                            </SignInButton>
                            <SignUpButton>
                              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                회원가입
                              </button>
                            </SignUpButton>
                          </div>
                        </SignedOut>
                        <SignedIn>
                          <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                      </div>
                    </div>
                  </div>
                </header>

                {/* Main Content */}
                <main className="relative">
                  {children}
                </main>
              </div>
            </AuthProvider>
          </WeatherProvider>
        </body>
      </html>
    </ClerkProvider>
  )
} 