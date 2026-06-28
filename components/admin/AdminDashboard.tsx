"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, ShoppingCart, Users, Package,
  Settings, TrendingUp, DollarSign, Activity,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { useSession } from "next-auth/react";

type Tab = "overview" | "orders" | "products" | "customers" | "settings";

const NAV_ITEMS: { key: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "orders", label: "Orders", icon: ShoppingCart },
  { key: "products", label: "Products", icon: Package },
  { key: "customers", label: "Customers", icon: Users },
  { key: "settings", label: "Settings", icon: Settings },
];

const STATS = [
  { label: "Total Revenue", value: 125430, trend: "+12%", icon: DollarSign, color: "text-green-500", bg: "bg-green-50" },
  { label: "Total Orders", value: "845", trend: "+5%", icon: ShoppingCart, color: "text-blue-500", bg: "bg-blue-50" },
  { label: "Active Customers", value: "1,204", trend: "+18%", icon: Users, color: "text-purple-500", bg: "bg-purple-50" },
  { label: "Conversion Rate", value: "3.2%", trend: "-1%", icon: Activity, color: "text-orange-500", bg: "bg-orange-50" },
];

const RECENT_ORDERS = [
  { id: "FM-A3X7K", customer: "Sarah Jenkins", total: 42.50, status: "DELIVERED", date: "2 mins ago" },
  { id: "FM-B8Y2M", customer: "Michael Chen", total: 128.90, status: "PREPARING", date: "15 mins ago" },
  { id: "FM-C4P9N", customer: "Emma Wilson", total: 34.20, status: "PENDING", date: "1 hour ago" },
  { id: "FM-D2K5L", customer: "David Miller", total: 89.50, status: "OUT_FOR_DELIVERY", date: "2 hours ago" },
];

const TOP_PRODUCTS = [
  { name: "Organic Bananas", sales: 450, revenue: 1345.50, inStock: 45 },
  { name: "Sourdough Bread", sales: 320, revenue: 1596.80, inStock: 12 },
  { name: "Fresh Milk 1L", sales: 280, revenue: 921.20, inStock: 80 },
];

export function AdminDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex-shrink-0 hidden lg:flex flex-col">
        <div className="p-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="font-bold text-gray-900">Admin Panel</span>
          </Link>
          <nav className="space-y-1">
            {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  activeTab === key
                    ? "bg-primary-500 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 capitalize">{activeTab}</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              Hello, {session?.user?.name || "Admin"}
            </span>
            <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 font-bold">
              {(session?.user?.name || "A")[0]}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {STATS.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="bg-white rounded-2xl shadow-sm p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg)}>
                          <Icon className={cn("w-6 h-6", stat.color)} />
                        </div>
                        <span className={cn(
                          "text-xs font-bold px-2 py-1 rounded-full",
                          stat.trend.startsWith("+") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        )}>
                          {stat.trend}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                      <p className="text-3xl font-extrabold text-gray-900 mt-1">
                        {typeof stat.value === "number" ? formatCurrency(stat.value) : stat.value}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-gray-900">Recent Orders</h2>
                    <button onClick={() => setActiveTab("orders")} className="text-sm text-primary-500 font-semibold">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
                          <th className="pb-3 font-semibold">Order ID</th>
                          <th className="pb-3 font-semibold">Customer</th>
                          <th className="pb-3 font-semibold">Status</th>
                          <th className="pb-3 font-semibold text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {RECENT_ORDERS.map((order) => (
                          <tr key={order.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                            <td className="py-4">
                              <span className="font-semibold text-gray-900">{order.id}</span>
                              <div className="text-xs text-gray-400 mt-0.5">{order.date}</div>
                            </td>
                            <td className="py-4 text-gray-600">{order.customer}</td>
                            <td className="py-4">
                              <span className={cn(
                                "text-xs px-2.5 py-1 rounded-full font-semibold",
                                order.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                                order.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                                order.status === "OUT_FOR_DELIVERY" ? "bg-purple-100 text-purple-700" :
                                "bg-blue-100 text-blue-700"
                              )}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-4 text-right font-bold text-gray-900">
                              {formatCurrency(order.total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="font-bold text-gray-900 mb-6">Top Selling Products</h2>
                  <div className="space-y-4">
                    {TOP_PRODUCTS.map((prod, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm mb-1">{prod.name}</p>
                          <div className="flex gap-3 text-xs">
                            <span className="text-gray-500">{prod.sales} sold</span>
                            <span className={cn("font-medium", prod.inStock < 20 ? "text-red-500" : "text-green-500")}>
                              {prod.inStock} in stock
                            </span>
                          </div>
                        </div>
                        <span className="font-bold text-primary-500 text-sm">
                          {formatCurrency(prod.revenue)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab !== "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-center py-20">
              <TrendingUp className="w-16 h-16 text-gray-200 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module</h2>
              <p className="text-gray-400">This section is currently under development.</p>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
