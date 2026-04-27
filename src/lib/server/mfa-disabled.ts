import { NextResponse } from 'next/server'

export function mfaDisabledResponse() {
  return NextResponse.json(
    {
      error: 'Two-factor authentication is temporarily unavailable.',
      feature: 'mfa',
      enabled: false,
    },
    { status: 501 }
  )
}
