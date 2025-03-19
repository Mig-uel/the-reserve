import { PrismaAdapter } from '@auth/prisma-adapter'
import { compareSync } from 'bcrypt-ts-edge'
import NextAuth, { type NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import { prisma } from './db/prisma'
import { cookies } from 'next/headers'

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

    async jwt({ trigger, token, user, session }) {
      // assign user fields to the token
      if (user) {
        token.id = user.id
        token.role = user.role

        if (trigger === 'signIn' || trigger === 'signUp') {
          const cookiesObject = await cookies()

          // get the session cart id from the cookies
          const sessionCartId = cookiesObject.get('sessionCartId')?.value

          // if session cart id exists
          if (sessionCartId !== user.id) {
            // find the session cart in the database
            const sessionCart = await prisma.cart.findFirst({
              where: {
                sessionCartId,
              },
            })

            // if database does not return a session cart
            if (!sessionCart) return token

            // if database returns a session cart
            if (sessionCart.userId !== user.id) {
              // delete the old session cart
              await prisma.cart.deleteMany({
                where: {
                  userId: user.id,
                },
              })

              // assign new session cart to the user
              await prisma.cart.update({
                where: {
                  id: sessionCart.id,
                },
                data: {
                  userId: user.id,
                },
              })
            }
          }
        }
      }

      // handle session updates
      if (session?.user.name && trigger === 'update') {
        token.name = session.user.name
      }

      return token
    },

    ...authConfig.callbacks,
  },
}

export const { auth, handlers, signIn, signOut } = NextAuth(config)
