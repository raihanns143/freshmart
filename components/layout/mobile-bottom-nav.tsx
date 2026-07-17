"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, ShoppingCart, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/context/CartContext";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { isAuthenticated, user, login } = useAuth();
  const { itemCount } = useCart();
  const isAdmin = user && ["SUPER_ADMIN", "ADMIN", "MANAGER", "EDITOR"].includes((user as any).role);

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Categories", href: "/shop", icon: Grid },
    { label: "Cart", href: "/cart", icon: ShoppingCart, count: itemCount },
    { label: "Wishlist", href: "/dashboard?tab=wishlist", icon: Heart },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <nav className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative",
                isActive ? "text-primary" : "text-gray-500 hover:text-gray-900"
              )}
            >
              <div className="relative">
                <Icon className={cn("w-6 h-6", isActive && "fill-primary/20")} strokeWidth={isActive ? 2.5 : 2} />
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
                    {item.count}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
        
        {/* Profile Button - Handles Auth state */}
        <Link
          href={isAuthenticated ? (isAdmin ? "/admin/dashboard" : "/dashboard") : "/login"}
          className={cn(
            "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
            pathname.startsWith("/dashboard") || pathname.startsWith("/admin/dashboard") ? "text-primary" : "text-gray-500 hover:text-gray-900"
          )}
        >
          <User className={cn("w-6 h-6", (pathname.startsWith("/dashboard") || pathname.startsWith("/admin/dashboard")) && "fill-primary/20")} strokeWidth={pathname.startsWith("/dashboard") || pathname.startsWith("/admin/dashboard") ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </nav>
    </div>
  );
}