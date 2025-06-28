import Link from 'next/link'
import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        
        {/* 로그인하지 않은 사용자 */}
        <SignedOut>
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              B Note
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              iOS 애플 메모장과 유사한 스타일·서식 편집 기능을 가진 스마트 노트 앱입니다.
              아이디어를 기록하고, 생각을 정리하세요.
            </p>
            
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <SignInButton mode="modal">
                <button className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                  로그인하여 시작하기
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                  무료 회원가입
                </button>
              </SignUpButton>
            </div>

            {/* 기능 소개 */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">✏️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">리치 텍스트 에디터</h3>
                <p className="text-gray-600">볼드, 이탤릭, 헤딩, 리스트 등 다양한 서식을 지원합니다.</p>
              </div>
              <div className="text-center">
                <div className="mx-auto h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">개인 노트 관리</h3>
                <p className="text-gray-600">로그인한 사용자만 자신의 노트를 볼 수 있습니다.</p>
              </div>
              <div className="text-center">
                <div className="mx-auto h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">모바일 친화적</h3>
                <p className="text-gray-600">모든 기기에서 편리하게 사용할 수 있습니다.</p>
              </div>
            </div>
          </div>
        </SignedOut>

        {/* 로그인한 사용자 */}
        <SignedIn>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              환영합니다! 👋
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              오늘도 멋진 아이디어를 기록해보세요.
            </p>
            
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link 
                href="/notes"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                📝 내 노트 보기
              </Link>
              <Link 
                href="/notes/new"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                ✨ 새 노트 작성
              </Link>
            </div>

            {/* 빠른 시작 메뉴 */}
            <div className="mt-16 text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">빠른 시작</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <Link 
                  href="/notes"
                  className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl mb-2">📚</div>
                  <div className="font-medium text-gray-900">전체 노트</div>
                  <div className="text-sm text-gray-500">모든 노트 보기</div>
                </Link>
                <Link 
                  href="/notes/new"
                  className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl mb-2">➕</div>
                  <div className="font-medium text-gray-900">새 노트</div>
                  <div className="text-sm text-gray-500">빠른 작성</div>
                </Link>
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-3xl mb-2">🔍</div>
                  <div className="font-medium text-gray-400">검색</div>
                  <div className="text-sm text-gray-400">곧 출시</div>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-3xl mb-2">🏷️</div>
                  <div className="font-medium text-gray-400">태그</div>
                  <div className="text-sm text-gray-400">곧 출시</div>
                </div>
              </div>
            </div>
          </div>
        </SignedIn>
      </div>
    </div>
  )
} 