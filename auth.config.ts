import type { NextAuthConfig } from "next-auth";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "MANAGER", "EDITOR"];

export const authConfig = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  trustHost: true,
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

      return true;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const { default: prismaMod } = await import("@/lib/prisma");
        const existing = await prismaMod.user.findUnique({
          where: { email: user.email as string },
          select: { id: true, role: true },
        });
        if (!existing) {
          await prismaMod.user.create({
            data: {
              email: user.email as string,
              name: user.name,
              image: user.image,
              role: "USER",
              emailVerified: new Date(),
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      // On sign in, persist user details
      if (user) {
        token.id = user.id;
        token.role = (user as any).role ?? "USER";
        token.email = user.email;
        token.picture = user.image;
      }

      // On session update (e.g., from client)
      if (trigger === "update" && session) {
        token.name = session.name ?? token.name;
        token.picture = session.image ?? token.picture;
      }

      // Re-fetch from DB if id is missing (e.g., token rotation)
      if (!token.id && token.email) {
        const { default: prismaMod } = await import("@/lib/prisma");
        const dbUser = await prismaMod.user.findUnique({
          where: { email: token.email as string },
          select: { id: true, role: true, name: true, image: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.name = dbUser.name;
          token.picture = dbUser.image;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
        session.user.name = token.name as string | null;
        session.user.image = token.picture as string | null;
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
