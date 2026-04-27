import { mfaDisabledResponse } from '@/lib/server/mfa-disabled'

export async function POST() {
  return mfaDisabledResponse()
}
