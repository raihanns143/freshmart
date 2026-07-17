"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Bell, Search, ChevronDown, LogOut, User, X, Package, ShoppingBag, Users, Tag } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

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
  "/admin/logs": "Activity Logs",
};

const QUICK_LINKS = [
  { label: "Products", href: "/admin/products", icon: Package, desc: "Manage your products" },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag, desc: "View all orders" },
  { label: "Customers", href: "/admin/customers", icon: Users, desc: "Customer management" },
  { label: "Coupons", href: "/admin/coupons", icon: Tag, desc: "Discount coupons" },
];

const NOTIFICATIONS = [
  { id: 1, title: "New order placed", desc: "Order #ORD-2025-001 needs review", time: "2m ago", unread: true, href: "/admin/orders" },
  { id: 2, title: "Low stock alert", desc: "River Prawns is running low", time: "15m ago", unread: true, href: "/admin/inventory" },
  { id: 3, title: "New review submitted", desc: "A new review awaits approval", time: "1h ago", unread: false, href: "/admin/reviews" },
  { id: 4, title: "New customer registered", desc: "Sabbir Ahmed just signed up", time: "3h ago", unread: false, href: "/admin/customers" },
];

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [profileOpen, setProfileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const searchRef = useRef<HTMLInputElement>(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  const pageTitle = breadcrumbMap[pathname] ??
    pathname.split("/").filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" › ");

  // ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setBellOpen(false);
        setProfileOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [searchOpen]);

  const filteredLinks = QUICK_LINKS.filter(l =>
    !searchQuery || l.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  }, []);

  return (
    <>
      {/* Search Modal Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search pages, products, orders..."
                className="flex-1 bg-transparent text-white text-sm placeholder-slate-500 outline-none"
                onKeyDown={e => {
                  if (e.key === "Enter" && filteredLinks.length > 0) {
                    router.push(filteredLinks[0].href);
                    setSearchOpen(false);
                  }
                }}
              />
              <button onClick={() => setSearchOpen(false)}>
                <X className="w-4 h-4 text-slate-500 hover:text-white" />
              </button>
            </div>
            <div className="py-2 max-h-72 overflow-y-auto">
              {filteredLinks.length === 0 ? (
                <p className="text-center text-sm text-slate-500 py-8">No results found</p>
              ) : (
                filteredLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-slate-700 flex items-center justify-center flex-shrink-0 transition-colors">
                      <link.icon className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{link.label}</p>
                      <p className="text-xs text-slate-500">{link.desc}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
            <div className="px-4 py-2 border-t border-slate-800 flex gap-3 text-[10px] text-slate-600">
              <span><kbd className="bg-slate-800 border border-slate-700 rounded px-1">↵</kbd> to navigate</span>
              <span><kbd className="bg-slate-800 border border-slate-700 rounded px-1">Esc</kbd> to close</span>
            </div>
          </div>
        </div>
      )}

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
          {/* Quick search trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-400 w-48 hover:border-slate-500 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="text-xs flex-1 text-left">Quick search...</span>
            <kbd className="text-[10px] bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5">⌘K</kbd>
          </button>

          {/* Notification bell */}
          <div className="relative">
            <button
              onClick={() => { setBellOpen(o => !o); setProfileOpen(false); }}
              className="relative w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-slate-950">
                  {unreadCount}
                </span>
              )}
            </button>

            {bellOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setBellOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                    <p className="text-sm font-semibold text-white">Notifications</p>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="divide-y divide-slate-800 max-h-80 overflow-y-auto">
                    {notifications.map(n => (
                      <Link
                        key={n.id}
                        href={n.href}
                        onClick={() => setBellOpen(false)}
                        className={`flex gap-3 px-4 py-3 hover:bg-slate-800 transition-colors ${n.unread ? "bg-blue-500/5" : ""}`}
                      >
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? "bg-blue-500" : "bg-slate-700"}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${n.unread ? "text-white" : "text-slate-300"}`}>{n.title}</p>
                          <p className="text-xs text-slate-500 truncate">{n.desc}</p>
                          <p className="text-[10px] text-slate-600 mt-0.5">{n.time}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-slate-800">
                    <Link href="/admin/logs" onClick={() => setBellOpen(false)} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                      View all activity →
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => { setProfileOpen(o => !o); setBellOpen(false); }}
              className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 hover:border-slate-500 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold">
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
                    <span className="inline-block mt-1 text-[10px] bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded px-1.5 py-0.5 uppercase tracking-wider">
                      {(session?.user as any)?.role ?? "ADMIN"}
                    </span>
                  </div>
                  <Link href="/admin/settings" onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <User className="w-3.5 h-3.5" />
                    <span>Profile Settings</span>
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
    </>
  );
}
