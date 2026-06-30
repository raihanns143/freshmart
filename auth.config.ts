import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [], // Providers are added in auth.ts to avoid Edge runtime issues with Node.js APIs
  callbacks: {
    async signIn({ user, account }) {
      // Allow all sign-ins
      return true;
    },
    async jwt({ token, user, account, trigger }) {
      // On initial sign-in, user object is available
      if (user) {
        token.id = user.id;
        token.role = (user as any).role ?? "USER";
        token.email = user.email;
      }
      // For OAuth providers: user.id may be undefined on first callback
      // Look it up from the database by email
      if (!token.id && token.email) {
        // Dynamic import to avoid edge runtime issues
        const { default: prisma } = await import("@/lib/prisma");
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // After sign-in, redirect to callbackUrl or home
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  }
} satisfies NextAuthConfig;

