'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'
import {
  Lock,
  Shield,
  Eye,
  EyeOff,
  PanelTop,
  ChevronRight,
} from 'lucide-react'

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  function getPasswordStrength(pwd: string): {
    score: number
    label: string
    color: string
  } {
    let score = 0
    if (pwd.length >= 8) score++
    if (pwd.length >= 12) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[a-z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++

    if (score <= 2) return { score: 1, label: 'Weak', color: '#ef4444' }
    if (score <= 4) return { score: 2, label: 'Fair', color: '#f59e0b' }
    return { score: 3, label: 'Strong', color: '#22c55e' }
  }

  const strength = getPasswordStrength(newPassword)
  const inputClass =
    'w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg font-josefin text-[#F5E6D0] placeholder:text-[#F5E6D0]/40 focus:outline-none focus:border-[#D4654A] focus:ring-2 focus:ring-[#D4654A]/20 transition-all duration-300'

  async function handleChangePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPasswordError('')
    setPasswordLoading(true)

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      })

      const data = await res.json()
      if (!res.ok) {
        setPasswordError(data.error ?? 'Failed to update password')
        return
      }

      toast.success('Password updated successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      setPasswordError('An unexpected error occurred')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="font-cormorant text-4xl md:text-5xl text-[#F5E6D0]">
          Settings
        </h1>
        <p className="font-josefin text-[#D4B896] text-sm mt-1">
          Manage your account security
        </p>
      </div>

      <div className="bg-[#1A2332] rounded-xl p-6 border border-[#F5E6D0]/10 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#D4654A]/10 rounded-lg">
            <Lock className="w-5 h-5 text-[#D4654A]" />
          </div>
          <div>
            <h2 className="font-cormorant text-2xl text-[#F5E6D0]">
              Change Password
            </h2>
            <p className="font-josefin text-[#D4B896]/60 text-xs">
              Update your admin password
            </p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className={inputClass + ' pr-12'}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D4B896]/60 hover:text-[#D4654A] transition-colors"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className={inputClass + ' pr-12'}
                placeholder="Minimum 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D4B896]/60 hover:text-[#D4654A] transition-colors"
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {newPassword && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor:
                          level <= strength.score
                            ? strength.color
                            : 'rgba(245, 230, 208, 0.1)',
                      }}
                    />
                  ))}
                </div>
                <p
                  className="font-josefin text-xs mt-1"
                  style={{ color: strength.color }}
                >
                  {strength.label}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={inputClass}
              placeholder="Re-enter new password"
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="font-josefin text-red-400 text-xs mt-1">
                Passwords do not match
              </p>
            )}
          </div>

          {passwordError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="font-josefin text-red-400 text-sm">
                {passwordError}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={
              passwordLoading ||
              !currentPassword ||
              !newPassword ||
              newPassword !== confirmPassword
            }
            className="w-full py-3 px-6 bg-[#D4654A] text-white font-josefin text-sm tracking-wider uppercase
              rounded-lg shadow-lg shadow-[#D4654A]/20
              hover:bg-[#D4654A]/90 hover:shadow-xl hover:shadow-[#D4654A]/30
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300"
          >
            {passwordLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      <div className="bg-[#1A2332] rounded-xl p-6 border border-[#F5E6D0]/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#D4654A]/10 rounded-lg">
            <Shield className="w-5 h-5 text-[#D4654A]" />
          </div>
          <div>
            <h2 className="font-cormorant text-2xl text-[#F5E6D0]">
              Two-Factor Authentication
            </h2>
            <p className="font-josefin text-[#D4B896]/60 text-xs">
              Temporarily unavailable
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-[#D4B896]/20 bg-[#141B2B] p-4">
          <p className="font-josefin text-[#D4B896] text-sm leading-relaxed">
            Two-factor authentication is parked while the verification flow is
            rebuilt. Password-only admin sign-in remains active, and the
            existing MFA database fields are preserved for a future rollout.
          </p>
        </div>
      </div>

      <Link
        href="/admin/settings/navigation"
        className="block bg-[#1A2332] rounded-xl p-6 border border-[#F5E6D0]/10 mt-6 group hover:border-[#D4654A]/30 transition-all duration-300"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#D4654A]/10 rounded-lg">
              <PanelTop className="w-5 h-5 text-[#D4654A]" />
            </div>
            <div>
              <h2 className="font-cormorant text-2xl text-[#F5E6D0]">
                Navigation
              </h2>
              <p className="font-josefin text-[#D4B896]/60 text-xs">
                Control which pages are visible to visitors
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#D4B896]/40 group-hover:text-[#D4654A] transition-colors" />
        </div>
      </Link>
    </div>
  )
}
