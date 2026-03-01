import * as OTPAuth from 'otpauth'

export function generateTotpSecret(email: string): {
  secret: string
  uri: string
} {
  const totp = new OTPAuth.TOTP({
    issuer: 'Forma Studio',
    label: email,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: new OTPAuth.Secret({ size: 20 }),
  })

  return {
    secret: totp.secret.base32,
    uri: totp.toString(),
  }
}

export function verifyTotpCode(secret: string, code: string): boolean {
  const totp = new OTPAuth.TOTP({
    issuer: 'Forma Studio',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  })

  // Allow 1 period window in each direction for clock drift
  const delta = totp.validate({ token: code, window: 1 })
  return delta !== null
}
