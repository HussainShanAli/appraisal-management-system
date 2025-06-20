import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/signup"]

  // Skip middleware for API routes, static files, etc.
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    publicRoutes.includes(pathname)
  ) {
    return NextResponse.next()
  }

  // Get token from cookies
  const token = request.cookies.get("token")?.value

  console.log("Middleware - Path:", pathname, "Token exists:", !!token)

  // If no token, redirect to login
  if (!token) {
    console.log("No token found, redirecting to login")
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    console.log("Token verified successfully:", !!decoded)
    return NextResponse.next()
  } catch (error) {
    console.log("Token verification failed:", error)
    // Invalid token, clear cookie and redirect to login
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.delete("token")
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
