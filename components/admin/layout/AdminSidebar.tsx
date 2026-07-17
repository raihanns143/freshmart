"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Package, Tag, Layers, ShoppingCart, Users,
  Warehouse, Ticket, Star, BarChart2, FileText, Image, Settings,
  Activity, LogOut, ChevronLeft, ShieldCheck, ChevronRight,
  Boxes, Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard",  label: "Dashboard",     icon: LayoutDashboard },
  { href: "/admin/products",   label: "Products",      icon: Package },
  { href: "/admin/categories", label: "Categories",    icon: Tag },
  { href: "/admin/brands",     label: "Brands",        icon: Layers },
  { href: "/admin/orders",     label: "Orders",        icon: ShoppingCart },
  { href: "/admin/customers",  label: "Customers",     icon: Users },
  { href: "/admin/inventory",  label: "Inventory",     icon: Warehouse },
  { href: "/admin/coupons",    label: "Coupons",       icon: Ticket },
  { href: "/admin/reviews",    label: "Reviews",       icon: Star },
  { href: "/admin/analytics",  label: "Analytics",     icon: BarChart2 },
  { href: "/admin/reports",    label: "Reports",       icon: FileText },
  { href: "/admin/media",      label: "Media Library", icon: Image },
  { href: "/admin/users",      label: "Users",         icon: Users },
  { href: "/admin/settings",   label: "Settings",      icon: Settings },
  { href: "/admin/logs",       label: "Activity Logs", icon: Activity },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full z-40 hidden lg:flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className={cn("flex items-center gap-3 px-4 py-5 border-b border-slate-800", collapsed && "justify-center")}>
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-blue-sm">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <p className="font-bold text-white text-sm leading-none">FreshMart</p>
              <p className="text-blue-400 text-xs mt-0.5">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-0.5 px-3">
          {/* Visit Store Action */}
          <Link
            href="/"
            title={collapsed ? "Visit Store" : undefined}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 mb-4 rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 transition-colors",
              collapsed && "justify-center px-0"
            )}
          >
            <Globe className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Visit Store</span>}
          </Link>

          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group",
                  active
                    ? "bg-blue-600/20 text-blue-400 font-medium"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
              >
                <Icon className={cn("w-4 h-4 flex-shrink-0", active ? "text-blue-400" : "group-hover:text-white")} />
                {!collapsed && <span>{label}</span>}
                {!collapsed && active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Collapse + Logout */}
        <div className="p-2 border-t border-slate-800 space-y-0.5">
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
          <button
            onClick={() => setCollapsed(c => !c)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay sidebar */}
      <MobileSidebar pathname={pathname} />
    </>
  );
}

function MobileSidebar({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 flex flex-col overflow-y-auto">
            <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800">
              <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-sm leading-none">FreshMart</p>
                <p className="text-blue-400 text-xs mt-0.5">Admin Panel</p>
              </div>
            </div>
            <nav className="flex-1 py-4 space-y-0.5 px-3">
              {/* Visit Store Action */}
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2.5 mb-4 rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 transition-colors"
                onClick={() => setOpen(false)}
              >
                <Globe className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">Visit Store</span>
              </Link>

              {navItems.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link key={href} href={href} onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                      active ? "bg-blue-600/20 text-blue-400 font-medium" : "text-slate-400 hover:text-white hover:bg-slate-800"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-2 border-t border-slate-800">
              <button onClick={() => signOut({ callbackUrl: "/admin/login" })} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10">
                <LogOut className="w-4 h-4" /><span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}
      <button
        className="fixed top-4 left-4 z-40 lg:hidden w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300"
        onClick={() => setOpen(true)}
      >
        <Boxes className="w-5 h-5" />
      </button>
    </>
  );
}
