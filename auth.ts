import { PrismaAdapter } from '@auth/prisma-adapter'
import { compareSync } from 'bcrypt-ts-edge'
import NextAuth, { type NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import { prisma } from './db/prisma'

export const config: NextAuthConfig = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },

  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60,
  },

  adapter: PrismaAdapter(prisma),

  providers: [
    Credentials({
      credentials: {
        email: {
          type: 'email',
        },
        password: {
          type: 'password',
        },
      },

      async authorize({ email, password }) {
        if (email === null || password === null) return null

        // find user in database
        const user = await prisma.user.findFirst({
          where: {
            email: email as string,
          },
        })

        //check if user exists and if password matches
        if (user && user.password) {
          const isMatch = compareSync(password as string, user.password)

          // if password is correct
          if (isMatch)
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            }
        }

        // if user does not exists or password does not match return null
        return null
      },
    }),
  ],

  callbacks: {
    async session({ session, token, user, trigger }) {
      // set the user ID from the token
      session.user.id = token.sub!
      session.user.role = token.role
      session.user.name = token.name

      // if there is an update, set the user's name
      if (trigger === 'update') {
        session.user.name = user.name
      }

      return session
    },

    async jwt({ token, user }) {
      // assign user fields to the token
      if (user) {
        token.role = user.role
      }

      return token
    },

    ...authConfig.callbacks,
  },
}

export const { auth, handlers, signIn, signOut } = NextAuth(config)
