import { prisma } from '@/db/prisma'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { compareSync } from 'bcrypt-ts-edge'
import NextAuth, { type NextAuthConfig } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const config: NextAuthConfig = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 30, // 30 days
  },

  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },

      async authorize(credentials, request) {
        if (credentials === null) return null

        // find user in db
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        })

        // check if user exists and if password matches
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          )

          // if password is correct, return user
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            }
          }
        }

        // if user does not exist or password does not match, return null
        return null
      },
    }),
  ],

  callbacks: {
    async session({ session, token, user, trigger }) {
      // set the user ID from the token
      session.user.id = token.sub as string

      // if there is an update, set the user name
      if (trigger === 'update') {
        session.user.name = user.name
      }

      return session
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)
