'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function MfaVerifyPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [useBackupCode, setUseBackupCode] = useState(false)
  const [backupCode, setBackupCode] = useState('')
  const [mfaMethod, setMfaMethod] = useState<string | null>(null)
  const [challengeSent, setChallengeSent] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const userId = session?.user?.id

  // Send MFA challenge on mount
  useEffect(() => {
    if (userId && !challengeSent) {
      sendChallenge()
      setChallengeSent(true)
    }
  }, [userId, challengeSent])

  useEffect(() => {
    inputRef.current?.focus()
  }, [useBackupCode])

  async function sendChallenge() {
    try {
      const res = await fetch('/api/auth/mfa/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()
      if (res.ok) {
        setMfaMethod(data.method)
      }
    } catch {
      // silently fail — user can resend
    }
  }

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/mfa/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          code: useBackupCode ? backupCode : code,
          isBackupCode: useBackupCode,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Verification failed')
        setLoading(false)
        return
      }

      // Clear MFA pending state and redirect
      await update()
      router.push('/admin')
      router.refresh()
    } catch {
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#141B2B] flex items-center justify-center p-4">
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
          <div className="text-center mb-8">
            <h1 className="font-cormorant text-4xl md:text-5xl text-[#F5E6D0] mb-2">
              Verification
            </h1>
            <p className="font-josefin text-[#D4B896] text-sm tracking-wider">
              {useBackupCode
                ? 'Enter a backup code'
                : mfaMethod === 'totp'
                  ? 'Enter the code from your authenticator app'
                  : 'Enter the code sent to your email'}
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            {useBackupCode ? (
              <div>
                <label
                  htmlFor="backupCode"
                  className="block font-josefin text-[#F5E6D0] text-sm mb-2"
                >
                  Backup Code
                </label>
                <input
                  ref={inputRef}
                  id="backupCode"
                  type="text"
                  value={backupCode}
                  onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
                  required
                  className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                    text-[#F5E6D0] placeholder:text-[#F5E6D0]/40 font-mono text-center text-lg tracking-wider
                    focus:outline-none focus:border-[#D4654A] focus:ring-2 focus:ring-[#D4654A]/20
                    transition-all duration-300"
                  placeholder="XXXX-XXXX"
                />
              </div>
            ) : (
              <div>
                <label
                  htmlFor="code"
                  className="block font-josefin text-[#F5E6D0] text-sm mb-2"
                >
                  Verification Code
                </label>
                <input
                  ref={inputRef}
                  id="code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  required
                  className="w-full px-4 py-4 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                    text-[#F5E6D0] placeholder:text-[#F5E6D0]/40 font-mono text-center text-2xl tracking-[0.5em]
                    focus:outline-none focus:border-[#D4654A] focus:ring-2 focus:ring-[#D4654A]/20
                    transition-all duration-300"
                  placeholder="000000"
                />
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="font-josefin text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={
                loading ||
                (useBackupCode ? !backupCode : code.length !== 6)
              }
              className="w-full py-3 px-6 bg-[#D4654A] text-white font-josefin text-sm tracking-wider uppercase
                rounded-lg shadow-lg shadow-[#D4654A]/20
                hover:bg-[#D4654A]/90 hover:shadow-xl hover:shadow-[#D4654A]/30
                focus:outline-none focus:ring-2 focus:ring-[#D4B896]
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10">
                {loading ? 'Verifying...' : 'Verify'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            </button>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setUseBackupCode(!useBackupCode)
                  setError('')
                }}
                className="font-josefin text-[#D4B896] text-sm hover:text-[#D4654A] transition-colors duration-300"
              >
                {useBackupCode ? 'Use verification code' : 'Use backup code'}
              </button>

              {mfaMethod === 'email' && !useBackupCode && (
                <button
                  type="button"
                  onClick={sendChallenge}
                  className="font-josefin text-[#D4B896] text-sm hover:text-[#D4654A] transition-colors duration-300"
                >
                  Resend code
                </button>
              )}
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-[#F5E6D0]/10">
            <p className="text-center font-josefin text-[#D4B896]/60 text-xs">
              Two-factor authentication required
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
