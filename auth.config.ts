import type { NextAuthConfig } from "next-auth";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "MANAGER", "EDITOR"];

export const authConfig = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60,   // 24 hours
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [],
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = (auth?.user as any)?.role ?? "USER";
      const isAdminPath = nextUrl.pathname.startsWith("/admin");
      const isAdminLoginPath = nextUrl.pathname === "/admin/login";
      const isDashboardPath = nextUrl.pathname.startsWith("/dashboard");

      if (isAdminPath) {
        if (isAdminLoginPath) {
          if (isLoggedIn && ADMIN_ROLES.includes(role)) {
            return Response.redirect(new URL("/admin/dashboard", nextUrl));
          }
          return true;
        }

        if (!isLoggedIn) {
          return Response.redirect(new URL("/admin/login", nextUrl));
        }
        if (!ADMIN_ROLES.includes(role)) {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      if (isDashboardPath && !isLoggedIn) {
        return Response.redirect(new URL("/login?callbackUrl=" + encodeURIComponent(nextUrl.pathname), nextUrl));
      }

      return true;
    },

    async signIn({ user, account, profile }) {
      // PrismaAdapter handles account linking automatically
      // allowDangerousEmailAccountLinking ensures no duplicate users
      return true;
    },

    async jwt({ token, user, account, trigger, session }) {
      // On initial sign in, user object is populated
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        // role comes from user for credentials, but for OAuth we need to fetch
        token.role = (user as any).role ?? "USER";
      }

      // Always re-fetch role from DB on Google OAuth sign in
      // because PrismaAdapter may not populate role in the returned user object
      if (account?.provider === "google" && token.email && !token.id) {
        const { default: prismaMod } = await import("@/lib/prisma");
        const dbUser = await prismaMod.user.findUnique({
          where: { email: token.email as string },
          select: { id: true, role: true, name: true, image: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.name = dbUser.name ?? token.name;
          token.picture = dbUser.image ?? token.picture;
        }
      }

      // If token has email but no id (token rotation edge case), re-fetch
      if (!token.id && token.email) {
        const { default: prismaMod } = await import("@/lib/prisma");
        const dbUser = await prismaMod.user.findUnique({
          where: { email: token.email as string },
          select: { id: true, role: true, name: true, image: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.name = dbUser.name ?? token.name;
          token.picture = dbUser.image ?? token.picture;
        }
      }

      // Update from client-side session.update() call
      if (trigger === "update" && session) {
        token.name = session.name ?? token.name;
        token.picture = session.image ?? token.picture;
        token.role = session.role ?? token.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = (token.role as string) ?? "USER";
        session.user.name = (token.name as string) ?? null;
        session.user.image = (token.picture as string) ?? null;
        session.user.email = (token.email as string) ?? session.user.email;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
} satisfies NextAuthConfig;
