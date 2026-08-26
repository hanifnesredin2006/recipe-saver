import NextAuth from "next-auth"
import { authEdgeConfig } from "@/lib/auth-edge-config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authEdgeConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAuthPage = req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register"

  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin))
  }
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/recipes", req.nextUrl.origin))
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}