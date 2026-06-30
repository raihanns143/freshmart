"use client";

import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Bell, Search, ChevronDown, LogOut, User, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const breadcrumbMap: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/products": "Products",
  "/admin/products/new": "New Product",
  "/admin/categories": "Categories",
  "/admin/brands": "Brands",
  "/admin/orders": "Orders",
  "/admin/customers": "Customers",
  "/admin/inventory": "Inventory",
  "/admin/coupons": "Coupons",
  "/admin/reviews": "Reviews",
  "/admin/analytics": "Analytics",
  "/admin/reports": "Reports",
  "/admin/media": "Media Library",
  "/admin/users": "Users",
  "/admin/settings": "Settings",
  "/admin/activity-logs": "Activity Logs",
};

export function AdminHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [profileOpen, setProfileOpen] = useState(false);

  const pageTitle = breadcrumbMap[pathname] ?? 
    pathname.split("/").filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" › ");

  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-sm border-b border-slate-800 px-4 md:px-6 lg:px-8 py-4 flex items-center gap-4">
      {/* Breadcrumb / Page Title */}
      <div className="flex-1 min-w-0 ml-10 lg:ml-0">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/admin/dashboard" className="hover:text-slate-300 transition-colors">Admin</Link>
          <span>/</span>
          <span className="text-slate-300">{pageTitle}</span>
        </div>
      </div>

      {/* Right: Search + Bell + Profile */}
      <div className="flex items-center gap-2">
        {/* Quick search */}
        <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-400 w-48 cursor-pointer hover:border-slate-600 transition-colors">
          <Search className="w-3.5 h-3.5" />
          <span className="text-xs">Quick search...</span>
          <kbd className="ml-auto text-[10px] bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5">⌘K</kbd>
        </div>

        {/* Notification bell */}
        <button className="relative w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(o => !o)}
            className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 hover:border-slate-600 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
              {session?.user?.name?.[0]?.toUpperCase() ?? "A"}
            </div>
            <span className="hidden sm:block text-sm text-slate-300 max-w-[100px] truncate">{session?.user?.name ?? "Admin"}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-20">
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <p className="text-sm font-medium text-white truncate">{session?.user?.name}</p>
                  <p className="text-xs text-slate-400 truncate">{session?.user?.email}</p>
                  <span className="inline-block mt-1 text-[10px] bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 rounded px-1.5 py-0.5 uppercase tracking-wider">
                    {(session?.user as any)?.role ?? "ADMIN"}
                  </span>
                </div>
                <Link href="/admin/settings" onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                  <User className="w-3.5 h-3.5" />
                  <span>Profile Settings</span>
                </Link>
                <Link href="/" target="_blank" onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Store</span>
                </Link>
                <div className="border-t border-slate-800 mt-1 pt-1">
                  <button onClick={() => signOut({ callbackUrl: "/admin/login" })}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
