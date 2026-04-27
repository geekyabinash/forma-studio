import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { users, navigationSettings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
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
          }
        } catch (error) {
          console.error('Auth authorize error:', error)
          return null
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdminRoute = nextUrl.pathname.startsWith('/admin')
      const isMfaVerifyRoute = nextUrl.pathname === '/mfa-verify'

      // MFA is intentionally parked until the full verification flow is rebuilt.
      if (isLoggedIn && isMfaVerifyRoute) {
        return Response.redirect(new URL('/admin', nextUrl))
      }

      if (isAdminRoute && !isLoggedIn) {
        return Response.redirect(new URL('/login', nextUrl))
      }

      // Check navigation visibility for public toggleable routes
      const toggleableRoutes = ['/projects', '/services', '/gallery', '/about', '/careers', '/contact']
      const matchedRoute = toggleableRoutes.find(
        (route) => nextUrl.pathname === route || nextUrl.pathname.startsWith(route + '/')
      )

      if (matchedRoute && !isAdminRoute) {
        try {
          const [settings] = await db.select().from(navigationSettings).limit(1)
          const visibility = settings?.visibility as Record<string, boolean> | undefined
          if (visibility && visibility[matchedRoute] === false) {
            return Response.redirect(new URL('/', nextUrl))
          }
        } catch (error) {
          // Fail-open: if DB is unavailable, allow access
          console.error('Navigation visibility check failed:', error)
        }
      }

      return true
    },
  },
})
