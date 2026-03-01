import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string))
          .limit(1)

        if (!user) return null

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!passwordMatch) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          mfaPending: user.mfaEnabled ?? false,
          mfaMethod: user.mfaMethod ?? null,
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id
        token.mfaPending = (user as any).mfaPending ?? false
        token.mfaMethod = (user as any).mfaMethod ?? null
      }
      // Allow clearing mfaPending via session update
      if (trigger === 'update') {
        token.mfaPending = false
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        ;(session as any).mfaPending = token.mfaPending ?? false
        ;(session as any).mfaMethod = token.mfaMethod ?? null
      }
      return session
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdminRoute = nextUrl.pathname.startsWith('/admin')
      const isMfaVerifyRoute = nextUrl.pathname === '/mfa-verify'
      const mfaPending = (auth as any)?.mfaPending ?? false

      // If MFA is pending, redirect to MFA verify page
      if (isLoggedIn && mfaPending && !isMfaVerifyRoute) {
        return Response.redirect(new URL('/mfa-verify', nextUrl))
      }

      // If MFA is verified, don't let them go back to MFA page
      if (isLoggedIn && !mfaPending && isMfaVerifyRoute) {
        return Response.redirect(new URL('/admin', nextUrl))
      }

      if (isAdminRoute && !isLoggedIn) {
        return Response.redirect(new URL('/login', nextUrl))
      }

      return true
    },
  },
})
