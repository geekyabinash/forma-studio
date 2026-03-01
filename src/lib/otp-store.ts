const OTP_TTL_MS = 5 * 60 * 1000 // 5 minutes

interface OtpEntry {
  code: string
  expiresAt: number
}

const store = new Map<string, OtpEntry>()

export function storeOtp(userId: string, code: string): void {
  store.set(userId, {
    code,
    expiresAt: Date.now() + OTP_TTL_MS,
  })
}

export function verifyOtp(userId: string, code: string): boolean {
  const entry = store.get(userId)
  if (!entry) return false

  if (Date.now() > entry.expiresAt) {
    store.delete(userId)
    return false
  }

  if (entry.code !== code) return false

  store.delete(userId)
  return true
}

export function deleteOtp(userId: string): void {
  store.delete(userId)
}
