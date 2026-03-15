'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import Link from 'next/link'
import {
  Lock,
  Shield,
  ShieldCheck,
  ShieldOff,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  Copy,
  Check,
  KeyRound,
  PanelTop,
  ChevronRight,
} from 'lucide-react'

type MfaStep = 'idle' | 'choose-method' | 'setup-email' | 'setup-totp' | 'verify' | 'backup-codes'

export default function SettingsPage() {
  const { data: session } = useSession()

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  // MFA state
  const [mfaEnabled, setMfaEnabled] = useState(false)
  const [mfaMethod, setMfaMethod] = useState<string | null>(null)
  const [mfaStep, setMfaStep] = useState<MfaStep>('idle')
  const [mfaLoading, setMfaLoading] = useState(false)
  const [mfaError, setMfaError] = useState('')
  const [verifyCode, setVerifyCode] = useState('')
  const [totpUri, setTotpUri] = useState('')
  const [totpManualKey, setTotpManualKey] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [copiedCodes, setCopiedCodes] = useState(false)
  const [disablePassword, setDisablePassword] = useState('')
  const [showDisableConfirm, setShowDisableConfirm] = useState(false)

  // Load MFA status
  useEffect(() => {
    if (session?.user?.id) {
      fetchMfaStatus()
    }
  }, [session])

  async function fetchMfaStatus() {
    try {
      const res = await fetch('/api/admin/mfa/status')
      if (res.ok) {
        const data = await res.json()
        setMfaEnabled(data.mfaEnabled)
        setMfaMethod(data.mfaMethod)
      }
    } catch {
      // Will show as disabled
    }
  }

  // Password strength
  function getPasswordStrength(pwd: string): { score: number; label: string; color: string } {
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

  // Handle password change
  async function handleChangePassword(e: React.FormEvent) {
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
        setPasswordError(data.error)
        setPasswordLoading(false)
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

  // MFA setup
  async function handleStartMfaSetup(method: 'email' | 'totp') {
    setMfaError('')
    setMfaLoading(true)

    try {
      const res = await fetch('/api/admin/mfa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMfaError(data.error)
        setMfaLoading(false)
        return
      }

      if (method === 'totp') {
        setTotpUri(data.uri)
        setTotpManualKey(data.secret)
        setMfaStep('setup-totp')
      } else {
        setMfaStep('setup-email')
      }
    } catch {
      setMfaError('Failed to start MFA setup')
    } finally {
      setMfaLoading(false)
    }
  }

  async function handleVerifyMfa(e: React.FormEvent) {
    e.preventDefault()
    setMfaError('')
    setMfaLoading(true)

    try {
      const res = await fetch('/api/admin/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verifyCode }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMfaError(data.error)
        setMfaLoading(false)
        return
      }

      setBackupCodes(data.backupCodes)
      setMfaStep('backup-codes')
      setMfaEnabled(true)
      toast.success('MFA enabled successfully')
    } catch {
      setMfaError('Verification failed')
    } finally {
      setMfaLoading(false)
    }
  }

  async function handleDisableMfa() {
    setMfaError('')
    setMfaLoading(true)

    try {
      const res = await fetch('/api/admin/mfa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: disablePassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMfaError(data.error)
        setMfaLoading(false)
        return
      }

      setMfaEnabled(false)
      setMfaMethod(null)
      setShowDisableConfirm(false)
      setDisablePassword('')
      setMfaStep('idle')
      toast.success('MFA disabled')
    } catch {
      setMfaError('Failed to disable MFA')
    } finally {
      setMfaLoading(false)
    }
  }

  function copyBackupCodes() {
    navigator.clipboard.writeText(backupCodes.join('\n'))
    setCopiedCodes(true)
    toast.success('Backup codes copied to clipboard')
    setTimeout(() => setCopiedCodes(false), 2000)
  }

  function resetMfaFlow() {
    setMfaStep('idle')
    setVerifyCode('')
    setTotpUri('')
    setTotpManualKey('')
    setBackupCodes([])
    setMfaError('')
  }

  const inputClass =
    'w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg font-josefin text-[#F5E6D0] placeholder:text-[#F5E6D0]/40 focus:outline-none focus:border-[#D4654A] focus:ring-2 focus:ring-[#D4654A]/20 transition-all duration-300'

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-cormorant text-4xl md:text-5xl text-[#F5E6D0]">
          Settings
        </h1>
        <p className="font-josefin text-[#D4B896] text-sm mt-1">
          Manage your account security
        </p>
      </div>

      {/* Change Password Card */}
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
          {/* Current Password */}
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

          {/* New Password */}
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

            {/* Password Strength */}
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

          {/* Confirm Password */}
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
            disabled={passwordLoading || !currentPassword || !newPassword || newPassword !== confirmPassword}
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

      {/* MFA Card */}
      <div className="bg-[#1A2332] rounded-xl p-6 border border-[#F5E6D0]/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#D4654A]/10 rounded-lg">
              <Shield className="w-5 h-5 text-[#D4654A]" />
            </div>
            <div>
              <h2 className="font-cormorant text-2xl text-[#F5E6D0]">
                Two-Factor Authentication
              </h2>
              <p className="font-josefin text-[#D4B896]/60 text-xs">
                Add an extra layer of security
              </p>
            </div>
          </div>

          {mfaEnabled && mfaStep === 'idle' && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span className="font-josefin text-green-400 text-xs uppercase tracking-wider">
                Active
              </span>
            </div>
          )}
        </div>

        {/* MFA Content */}
        {mfaStep === 'idle' && !mfaEnabled && (
          <div>
            <p className="font-josefin text-[#D4B896] text-sm mb-6 leading-relaxed">
              Two-factor authentication adds a second verification step when you
              sign in, protecting your account even if your password is
              compromised.
            </p>
            <button
              onClick={() => setMfaStep('choose-method')}
              className="w-full py-3 px-6 bg-[#D4654A] text-white font-josefin text-sm tracking-wider uppercase
                rounded-lg shadow-lg shadow-[#D4654A]/20
                hover:bg-[#D4654A]/90 hover:shadow-xl hover:shadow-[#D4654A]/30
                transition-all duration-300"
            >
              Enable Two-Factor Authentication
            </button>
          </div>
        )}

        {mfaStep === 'idle' && mfaEnabled && (
          <div>
            <div className="p-4 bg-[#141B2B] rounded-lg mb-4">
              <div className="flex items-center gap-3">
                {mfaMethod === 'totp' ? (
                  <Smartphone className="w-5 h-5 text-[#D4B896]" />
                ) : (
                  <Mail className="w-5 h-5 text-[#D4B896]" />
                )}
                <div>
                  <p className="font-josefin text-[#F5E6D0] text-sm">
                    {mfaMethod === 'totp'
                      ? 'Authenticator App'
                      : 'Email Verification'}
                  </p>
                  <p className="font-josefin text-[#D4B896]/60 text-xs">
                    {mfaMethod === 'totp'
                      ? 'Using Google Authenticator or compatible app'
                      : `Codes sent to ${session?.user?.email}`}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowDisableConfirm(true)}
              className="w-full py-3 px-6 bg-[#141B2B] border border-red-500/20 text-red-400 font-josefin text-sm tracking-wider uppercase
                rounded-lg hover:bg-red-500/10 hover:border-red-500/40
                transition-all duration-300"
            >
              Disable Two-Factor Authentication
            </button>

            {/* Disable confirmation */}
            {showDisableConfirm && (
              <div className="mt-4 p-4 bg-[#141B2B] rounded-lg border border-red-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldOff className="w-4 h-4 text-red-400" />
                  <p className="font-josefin text-red-400 text-sm font-medium">
                    Confirm Disable
                  </p>
                </div>
                <p className="font-josefin text-[#D4B896] text-xs mb-3">
                  Enter your password to disable two-factor authentication.
                </p>
                <input
                  type="password"
                  value={disablePassword}
                  onChange={(e) => setDisablePassword(e.target.value)}
                  className={inputClass + ' mb-3'}
                  placeholder="Enter your password"
                />
                {mfaError && (
                  <p className="font-josefin text-red-400 text-xs mb-3">
                    {mfaError}
                  </p>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={handleDisableMfa}
                    disabled={mfaLoading || !disablePassword}
                    className="flex-1 py-2 px-4 bg-red-500 text-white font-josefin text-xs tracking-wider uppercase
                      rounded-lg hover:bg-red-600 disabled:opacity-50 transition-all duration-300"
                  >
                    {mfaLoading ? 'Disabling...' : 'Disable'}
                  </button>
                  <button
                    onClick={() => {
                      setShowDisableConfirm(false)
                      setDisablePassword('')
                      setMfaError('')
                    }}
                    className="flex-1 py-2 px-4 bg-[#1A2332] border border-[#F5E6D0]/20 text-[#F5E6D0] font-josefin text-xs tracking-wider uppercase
                      rounded-lg hover:border-[#F5E6D0]/40 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {mfaStep === 'choose-method' && (
          <div className="space-y-3">
            <p className="font-josefin text-[#D4B896] text-sm mb-4">
              Choose your preferred verification method:
            </p>

            <button
              onClick={() => handleStartMfaSetup('totp')}
              disabled={mfaLoading}
              className="w-full p-4 bg-[#141B2B] border border-[#F5E6D0]/10 rounded-lg
                hover:border-[#D4654A]/40 hover:bg-[#D4654A]/5
                transition-all duration-300 text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-[#D4654A]/10 rounded-lg group-hover:bg-[#D4654A]/20 transition-colors">
                  <Smartphone className="w-5 h-5 text-[#D4654A]" />
                </div>
                <div>
                  <p className="font-josefin text-[#F5E6D0] text-sm font-medium">
                    Authenticator App
                  </p>
                  <p className="font-josefin text-[#D4B896]/60 text-xs">
                    Use Google Authenticator or a compatible app
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleStartMfaSetup('email')}
              disabled={mfaLoading}
              className="w-full p-4 bg-[#141B2B] border border-[#F5E6D0]/10 rounded-lg
                hover:border-[#D4654A]/40 hover:bg-[#D4654A]/5
                transition-all duration-300 text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-[#D4654A]/10 rounded-lg group-hover:bg-[#D4654A]/20 transition-colors">
                  <Mail className="w-5 h-5 text-[#D4654A]" />
                </div>
                <div>
                  <p className="font-josefin text-[#F5E6D0] text-sm font-medium">
                    Email Verification
                  </p>
                  <p className="font-josefin text-[#D4B896]/60 text-xs">
                    Receive a code at {session?.user?.email}
                  </p>
                </div>
              </div>
            </button>

            {mfaError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="font-josefin text-red-400 text-sm">{mfaError}</p>
              </div>
            )}

            <button
              onClick={resetMfaFlow}
              className="w-full py-2 font-josefin text-[#D4B896] text-sm hover:text-[#D4654A] transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {mfaStep === 'setup-totp' && (
          <div className="space-y-4">
            <p className="font-josefin text-[#D4B896] text-sm leading-relaxed">
              Scan this QR code with your authenticator app, then enter the
              6-digit code to verify.
            </p>

            {/* QR Code */}
            <div className="flex justify-center p-6 bg-white rounded-lg">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(totpUri)}`}
                alt="TOTP QR Code"
                width={200}
                height={200}
              />
            </div>

            {/* Manual Key */}
            <div className="p-3 bg-[#141B2B] rounded-lg">
              <p className="font-josefin text-[#D4B896]/60 text-xs mb-1">
                Manual entry key:
              </p>
              <p className="font-mono text-[#F5E6D0] text-sm break-all select-all">
                {totpManualKey}
              </p>
            </div>

            {/* Verify code */}
            <form onSubmit={handleVerifyMfa}>
              <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                Verification Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={verifyCode}
                onChange={(e) =>
                  setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                }
                className={inputClass + ' font-mono text-center text-xl tracking-[0.3em]'}
                placeholder="000000"
              />

              {mfaError && (
                <p className="font-josefin text-red-400 text-xs mt-2">
                  {mfaError}
                </p>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  disabled={mfaLoading || verifyCode.length !== 6}
                  className="flex-1 py-3 px-6 bg-[#D4654A] text-white font-josefin text-sm tracking-wider uppercase
                    rounded-lg hover:bg-[#D4654A]/90 disabled:opacity-50 transition-all duration-300"
                >
                  {mfaLoading ? 'Verifying...' : 'Verify & Enable'}
                </button>
                <button
                  type="button"
                  onClick={resetMfaFlow}
                  className="py-3 px-6 bg-[#141B2B] border border-[#F5E6D0]/20 text-[#F5E6D0] font-josefin text-sm tracking-wider uppercase
                    rounded-lg hover:border-[#F5E6D0]/40 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {mfaStep === 'setup-email' && (
          <div className="space-y-4">
            <div className="p-4 bg-[#141B2B] rounded-lg flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#D4654A]" />
              <p className="font-josefin text-[#F5E6D0] text-sm">
                A verification code has been sent to{' '}
                <span className="text-[#D4654A]">{session?.user?.email}</span>
              </p>
            </div>

            <form onSubmit={handleVerifyMfa}>
              <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                Enter Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={verifyCode}
                onChange={(e) =>
                  setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                }
                className={inputClass + ' font-mono text-center text-xl tracking-[0.3em]'}
                placeholder="000000"
                autoFocus
              />

              {mfaError && (
                <p className="font-josefin text-red-400 text-xs mt-2">
                  {mfaError}
                </p>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  disabled={mfaLoading || verifyCode.length !== 6}
                  className="flex-1 py-3 px-6 bg-[#D4654A] text-white font-josefin text-sm tracking-wider uppercase
                    rounded-lg hover:bg-[#D4654A]/90 disabled:opacity-50 transition-all duration-300"
                >
                  {mfaLoading ? 'Verifying...' : 'Verify & Enable'}
                </button>
                <button
                  type="button"
                  onClick={resetMfaFlow}
                  className="py-3 px-6 bg-[#141B2B] border border-[#F5E6D0]/20 text-[#F5E6D0] font-josefin text-sm tracking-wider uppercase
                    rounded-lg hover:border-[#F5E6D0]/40 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {mfaStep === 'backup-codes' && (
          <div className="space-y-4">
            <div className="p-4 bg-[#D4654A]/10 border border-[#D4654A]/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <KeyRound className="w-4 h-4 text-[#D4654A]" />
                <p className="font-josefin text-[#D4654A] text-sm font-medium">
                  Save Your Backup Codes
                </p>
              </div>
              <p className="font-josefin text-[#D4B896] text-xs leading-relaxed">
                These codes can be used to access your account if you lose your
                authentication device. Each code can only be used once.{' '}
                <strong className="text-[#F5E6D0]">
                  Store them somewhere safe — they won't be shown again.
                </strong>
              </p>
            </div>

            <div className="p-4 bg-[#141B2B] rounded-lg">
              <div className="grid grid-cols-2 gap-2">
                {backupCodes.map((code, i) => (
                  <div
                    key={i}
                    className="px-3 py-2 bg-[#1A2332] rounded font-mono text-[#F5E6D0] text-sm text-center select-all"
                  >
                    {code}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={copyBackupCodes}
              className="w-full py-3 px-6 bg-[#141B2B] border border-[#F5E6D0]/20 text-[#F5E6D0] font-josefin text-sm tracking-wider uppercase
                rounded-lg hover:border-[#D4654A] hover:text-[#D4654A]
                transition-all duration-300 flex items-center justify-center gap-2"
            >
              {copiedCodes ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy All Codes
                </>
              )}
            </button>

            <button
              onClick={() => {
                resetMfaFlow()
                fetchMfaStatus()
              }}
              className="w-full py-3 px-6 bg-[#D4654A] text-white font-josefin text-sm tracking-wider uppercase
                rounded-lg hover:bg-[#D4654A]/90 transition-all duration-300"
            >
              I've Saved My Codes
            </button>
          </div>
        )}
      </div>

      {/* Navigation Settings Card */}
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
