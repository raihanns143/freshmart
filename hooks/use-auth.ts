import { useSession, signIn, signOut } from "next-auth/react";
import { useCallback } from "react";

export function useAuth() {
  const { data: session, status, update } = useSession();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const isUnauthenticated = status === "unauthenticated";
  const user = session?.user ?? null;

  const login = useCallback(
    async (provider?: string, options?: any) => {
      await signIn(provider, options);
    },
    []
  );

  const logout = useCallback(
    async (options?: any) => {
      await signOut(options);
    },
    []
  );

  return {
    session,
    user,
    status,
    isLoading,
    isAuthenticated,
    isUnauthenticated,
    login,
    logout,
    updateSession: update,
  };
}
