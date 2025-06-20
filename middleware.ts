import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/signup"]

  // Skip middleware for API routes, static files, etc.
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes("/.well-known/") ||
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

  // For Edge runtime compatibility, we'll do a simple token existence check
  // The actual verification will happen in the API routes and page components
  try {
    // Basic token format validation (should be JWT format: xxx.yyy.zzz)
    const tokenParts = token.split(".")
    if (tokenParts.length !== 3) {
      throw new Error("Invalid token format")
    }

    console.log("Token format valid, allowing access")
    return NextResponse.next()
  } catch (error) {
    console.log("Token validation failed:", error)
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
