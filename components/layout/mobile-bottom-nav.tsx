"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Search, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { isAuthenticated, login } = useAuth();

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Categories", href: "/shop", icon: Grid },
    { label: "Search", href: "/search", icon: Search },
    { label: "Wishlist", href: "/wishlist", icon: Heart },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive ? "text-primary" : "text-gray-500 hover:text-gray-900"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "fill-primary/20")} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
        
        {/* Profile Button - Handles Auth state */}
        <button
          onClick={() => {
            if (!isAuthenticated) {
              login();
            } else {
              window.location.href = "/dashboard/customer";
            }
          }}
          className={cn(
            "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
            pathname.startsWith("/dashboard") ? "text-primary" : "text-gray-500 hover:text-gray-900"
          )}
        >
          <User className={cn("w-6 h-6", pathname.startsWith("/dashboard") && "fill-primary/20")} strokeWidth={pathname.startsWith("/dashboard") ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </nav>
    </div>
  );
}
