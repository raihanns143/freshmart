import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

export const { auth } = NextAuth(authConfig);

// Protected route patterns
const PROTECTED_CUSTOMER_ROUTES = ["/dashboard/customer", "/checkout"];
const PROTECTED_ADMIN_ROUTES = ["/dashboard/admin"];
const AUTH_ROUTES = ["/login", "/register"];

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session?.user;
  const role = (session?.user as any)?.role;
  const pathname = nextUrl.pathname;

  // Redirect authenticated users away from login/register
  if (isLoggedIn && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Redirect unauthenticated users away from protected customer routes
  if (!isLoggedIn && PROTECTED_CUSTOMER_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, nextUrl));
  }

  // Redirect non-admins away from admin routes
  if (PROTECTED_ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    if (role !== "ADMIN" && role !== "MANAGER") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
