import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "MANAGER", "EDITOR"];

export default auth(async function middleware(req: NextRequest & { auth?: any }) {
  const session = (req as any).auth;
  const { pathname } = req.nextUrl;

  // Admin path protection
  if (pathname.startsWith("/admin")) {
    const isAdminLogin = pathname === "/admin/login";

    if (isAdminLogin) {
      // Already authenticated admin → redirect to dashboard
      if (session?.user && ADMIN_ROLES.includes((session.user as any).role)) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
      return NextResponse.next();
    }

    // Not logged in → admin login
    if (!session?.user) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Logged in but wrong role → home
    if (!ADMIN_ROLES.includes((session.user as any).role)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!api|_next/static|_next/image|favicon|public|uploads).*)",
  ],
};
