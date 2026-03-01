'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!token) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="font-josefin text-red-400 text-sm">
            Invalid reset link. Please request a new one.
          </p>
        </div>
        <Link
          href="/forgot-password"
          className="block w-full py-3 px-6 bg-[#D4654A] text-white font-josefin text-sm tracking-wider uppercase
            rounded-lg text-center hover:bg-[#D4654A]/90 transition-all duration-300"
        >
          Request New Link
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword, confirmPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to reset password')
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => router.push('/login'), 3000)
    } catch {
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="font-josefin text-green-400 text-sm">
            Password reset successfully! Redirecting to login...
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="newPassword"
          className="block font-josefin text-[#F5E6D0] text-sm mb-2"
        >
          New Password
        </label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={8}
          className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
            text-[#F5E6D0] placeholder:text-[#F5E6D0]/40
            focus:outline-none focus:border-[#D4654A] focus:ring-2 focus:ring-[#D4654A]/20
            transition-all duration-300"
          placeholder="Minimum 8 characters"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block font-josefin text-[#F5E6D0] text-sm mb-2"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
            text-[#F5E6D0] placeholder:text-[#F5E6D0]/40
            focus:outline-none focus:border-[#D4654A] focus:ring-2 focus:ring-[#D4654A]/20
            transition-all duration-300"
          placeholder="Re-enter your password"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="font-josefin text-red-400 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-6 bg-[#D4654A] text-white font-josefin text-sm tracking-wider uppercase
          rounded-lg shadow-lg shadow-[#D4654A]/20
          hover:bg-[#D4654A]/90 hover:shadow-xl hover:shadow-[#D4654A]/30
          focus:outline-none focus:ring-2 focus:ring-[#D4B896]
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-300 relative overflow-hidden group"
      >
        <span className="relative z-10">
          {loading ? 'Resetting...' : 'Reset Password'}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
      </button>
    </form>
  )
}

export default function ResetPasswordPage() {
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
              New Password
            </h1>
            <p className="font-josefin text-[#D4B896] text-sm tracking-wider">
              Set a new password for your account
            </p>
          </div>

          <Suspense
            fallback={
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-[#D4654A] border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
