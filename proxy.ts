import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected route patterns - only these are checked
const PROTECTED_CUSTOMER_ROUTES = ["/dashboard/customer", "/checkout"];
const PROTECTED_ADMIN_ROUTES = ["/dashboard/admin"];
const AUTH_ROUTES = ["/login", "/register"];

export function proxy(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  // Check for the NextAuth session token cookie (works for both JWT and DB sessions)
  const sessionToken =
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value;

  const isLoggedIn = !!sessionToken;

  // Redirect authenticated users away from login/register
  if (isLoggedIn && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Redirect unauthenticated users away from protected customer routes
  if (
    !isLoggedIn &&
    PROTECTED_CUSTOMER_ROUTES.some((r) => pathname.startsWith(r))
  ) {
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, nextUrl)
    );
  }

  // For admin routes, redirect to login if not authenticated
  // (role check happens server-side in the admin layout)
  if (PROTECTED_ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
