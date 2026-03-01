'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
        setLoading(false)
        return
      }

      router.push('/admin')
      router.refresh()
    } catch (err) {
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#141B2B] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F5E6D0' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}/>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#D4654A]/20 via-[#D4B896]/20 to-[#D4654A]/20 rounded-2xl blur-xl" />

        <div className="relative bg-[#1A2332] rounded-2xl p-8 md:p-10 shadow-2xl border border-[#F5E6D0]/10">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="font-cormorant text-4xl md:text-5xl text-[#F5E6D0] mb-2">
              Forma Studio
            </h1>
            <p className="font-josefin text-[#D4B896] text-sm tracking-wider uppercase">
              Admin Portal
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
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

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="font-josefin text-[#F5E6D0] text-sm"
                >
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="font-josefin text-[#D4B896] text-xs hover:text-[#D4654A] transition-colors duration-300"
                >
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                  text-[#F5E6D0] placeholder:text-[#F5E6D0]/40
                  focus:outline-none focus:border-[#D4654A] focus:ring-2 focus:ring-[#D4654A]/20
                  transition-all duration-300"
                placeholder="Enter your password"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="font-josefin text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-[#D4654A] text-white font-josefin text-sm tracking-wider uppercase
                rounded-lg shadow-lg shadow-[#D4654A]/20
                hover:bg-[#D4654A]/90 hover:shadow-xl hover:shadow-[#D4654A]/30
                focus:outline-none focus:ring-2 focus:ring-[#D4B896]
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-300
                relative overflow-hidden group"
            >
              <span className="relative z-10">
                {loading ? 'Signing In...' : 'Sign In'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            </button>
          </form>

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
