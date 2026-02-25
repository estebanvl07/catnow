import { NextResponse, type NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const isAdmin = request.nextUrl.pathname.startsWith("/admin")
  const isOnboarding = request.nextUrl.pathname === "/onboarding"

  if (isAdmin || isOnboarding) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })
    if (!token) {
      const loginUrl = new URL("/auth/login", request.url)
      if (isAdmin) {
        loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
      }
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
