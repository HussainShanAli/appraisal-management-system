import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/signup"]

  // Check if the current path is a public route
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Get token from cookies
  const token = request.cookies.get("token")?.value

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Verify token
  const decoded = verifyToken(token)
  if (!decoded) {
    // Invalid token, clear cookie and redirect to login
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.delete("token")
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
