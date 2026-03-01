'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const errorMessages: Record<string, string> = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have permission to access this resource.',
  Verification: 'The verification link may have expired or already been used.',
  CredentialsSignin: 'Invalid email or password. Please try again.',
  SessionRequired: 'Please sign in to access this page.',
  Default: 'An unexpected authentication error occurred.',
}

function ErrorContent() {
  const searchParams = useSearchParams()
  const errorCode = searchParams.get('error') ?? 'Default'
  const message = errorMessages[errorCode] ?? errorMessages.Default

  return (
    <div className="min-h-screen bg-[#141B2B] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F5E6D0' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#D4654A]/20 via-[#D4B896]/20 to-[#D4654A]/20 rounded-2xl blur-xl" />

        <div className="relative bg-[#1A2332] rounded-2xl p-8 md:p-10 shadow-2xl border border-[#F5E6D0]/10">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="font-cormorant text-4xl md:text-5xl text-[#F5E6D0] mb-2">
              Forma Studio
            </h1>
            <p className="font-josefin text-[#D4B896] text-sm tracking-wider uppercase">
              Admin Portal
            </p>
          </div>

          {/* Error Message */}
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-6">
            <p className="font-josefin text-red-400 text-sm text-center">
              {message}
            </p>
          </div>

          {/* Back to Login */}
          <a
            href="/login"
            className="block w-full py-3 px-6 bg-[#D4654A] text-white font-josefin text-sm tracking-wider uppercase
              rounded-lg shadow-lg shadow-[#D4654A]/20 text-center
              hover:bg-[#D4654A]/90 hover:shadow-xl hover:shadow-[#D4654A]/30
              transition-all duration-300"
          >
            Back to Login
          </a>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-[#F5E6D0]/10">
            <p className="text-center font-josefin text-[#D4B896]/60 text-xs">
              Secure access for authorized personnel only
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#141B2B] flex items-center justify-center">
          <p className="font-josefin text-[#D4B896] text-sm">Loading...</p>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  )
}
