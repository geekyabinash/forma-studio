'use client'

import {
  SessionProvider,
  useSession,
  signOut as nextAuthSignOut,
} from 'next-auth/react'
import { createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'

type AuthContextType = {
  user: { email?: string | null; name?: string | null } | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
})

function AuthContextInner({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleSignOut = async () => {
    await nextAuthSignOut({ redirect: false })
    router.push('/login')
    router.refresh()
  }

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        loading: status === 'loading',
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextInner>{children}</AuthContextInner>
    </SessionProvider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
