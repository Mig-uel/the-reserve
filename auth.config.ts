import type { NextAuthConfig } from 'next-auth'
import { NextResponse } from 'next/server'

export const authConfig = {
  providers: [], // Required by NextAuthConfig type
  callbacks: {
    authorized({ auth, request }) {
      // Array of regex patterns of paths that we want to protect
      const protectedPaths = [
        /\/shipping/,
        /\/payment/,
        /\/place-order/,
        /\/profile/,
        /\/order/,
        /\/user\/(.*)/,
        /\/admin/,
      ]

      // Get pathname from the request URL
      const { pathname } = request.nextUrl

      // check if user is not authenticated and accessing a protected path
      if (!auth && protectedPaths.some((path) => path.test(pathname)))
        return false

      // Check for session cart cookie
      if (!request.cookies.get('sessionCartId')) {
        // Generate new session cart id cookie
        const sessionCartId = crypto.randomUUID()

        // Create new response and add the new headers
        const response = NextResponse.next({
          request: {
            headers: new Headers(request.headers),
          },
        })

        // Set newly generated sessionCartId in the response cookies
        response.cookies.set('sessionCartId', sessionCartId)

        return response
      }

      return true
    },
  },
} satisfies NextAuthConfig
