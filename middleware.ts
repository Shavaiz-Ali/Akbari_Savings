import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicRoutes = ["/login", "/signup"]

function getDashboardForRole(role: string | undefined): string {
  if (role === "admin") return "/admin/dashboard"
  if (role === "member") return "/member/dashboard"
  return "/login"
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log(`[Middleware Debug] Path: ${pathname} | Has Token: ${!!token} | Token Role: ${token?.role} | Secret Length: ${process.env.NEXTAUTH_SECRET?.length || 0}`)

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  )

  // ── Unauthenticated users ──
  if (!token) {
    if (isPublicRoute) {
      return NextResponse.next()
    }
    const loginUrl = new URL("/login", req.url)
    return NextResponse.redirect(loginUrl)
  }

  // ── Authenticated users on public routes → send to their dashboard ──
  if (isPublicRoute) {
    const dashboardUrl = new URL(getDashboardForRole(token.role), req.url)
    return NextResponse.redirect(dashboardUrl)
  }

  // ── Root `/` → redirect based on role ──
  if (pathname === "/") {
    const dashboardUrl = new URL(getDashboardForRole(token.role), req.url)
    return NextResponse.redirect(dashboardUrl)
  }

  // ── Admin routes → require admin role ──
  if (pathname.startsWith("/admin")) {
    if (token.role !== "admin") {
      const dashboardUrl = new URL(getDashboardForRole(token.role), req.url)
      return NextResponse.redirect(dashboardUrl)
    }
  }

  // ── Member routes → require member or admin role ──
  if (pathname.startsWith("/member")) {
    if (token.role !== "member" && token.role !== "admin") {
      const dashboardUrl = new URL(getDashboardForRole(token.role), req.url)
      return NextResponse.redirect(dashboardUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
