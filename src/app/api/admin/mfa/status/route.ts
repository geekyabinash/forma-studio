import { mfaDisabledResponse } from '@/lib/server/mfa-disabled'

export async function GET() {
  return mfaDisabledResponse()
}
