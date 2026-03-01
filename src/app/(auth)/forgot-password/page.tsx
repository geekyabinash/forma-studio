'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setSubmitted(true)
    } catch {
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

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
          <div className="text-center mb-8">
            <h1 className="font-cormorant text-4xl md:text-5xl text-[#F5E6D0] mb-2">
              Reset Password
            </h1>
            <p className="font-josefin text-[#D4B896] text-sm tracking-wider">
              {submitted
                ? 'Check your email'
                : 'Enter your email to receive a reset link'}
            </p>
          </div>

          {submitted ? (
            <div className="space-y-6">
              <div className="p-4 bg-[#D4654A]/10 border border-[#D4654A]/20 rounded-lg">
                <p className="font-josefin text-[#F5E6D0] text-sm leading-relaxed">
                  If an account with that email exists, a password reset link
                  has been sent. Please check your inbox.
                </p>
              </div>
              <Link
                href="/login"
                className="block w-full py-3 px-6 bg-[#141B2B] border border-[#F5E6D0]/20 text-[#F5E6D0] font-josefin text-sm tracking-wider uppercase
                  rounded-lg text-center hover:border-[#D4654A] hover:text-[#D4654A] transition-all duration-300"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block font-josefin text-[#F5E6D0] text-sm mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                    text-[#F5E6D0] placeholder:text-[#F5E6D0]/40
                    focus:outline-none focus:border-[#D4654A] focus:ring-2 focus:ring-[#D4654A]/20
                    transition-all duration-300"
                  placeholder="admin@formastudio.in"
                />
              </div>

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
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              </button>

              <Link
                href="/login"
                className="block text-center font-josefin text-[#D4B896] text-sm hover:text-[#D4654A] transition-colors duration-300"
              >
                Back to Sign In
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
