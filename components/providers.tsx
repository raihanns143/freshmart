"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { SettingsProvider, StoreSettings } from "@/context/SettingsContext";
import React, { useState } from "react";

export function Providers({ children, settings }: { children: React.ReactNode; settings?: StoreSettings }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <WishlistProvider>
            <SettingsProvider settings={settings}>
              {children}
            </SettingsProvider>
          </WishlistProvider>
        </CartProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
