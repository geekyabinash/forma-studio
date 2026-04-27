import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function MfaVerifyPage() {
  const session = await auth()
  redirect(session?.user ? '/admin' : '/login')
}
