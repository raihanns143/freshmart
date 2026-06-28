"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingBag, Heart, MapPin, Settings, LogOut,
  Package, Clock, ChevronRight, Star, User,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { formatCurrency, cn } from "@/lib/utils";

const MOCK_ORDERS = [
  {
    id: "ord-001",
    number: "FM-A3X7K",
    date: "June 25, 2024",
    status: "DELIVERED",
    total: 42.50,
    itemCount: 5,
    items: [
      { name: "Organic Bananas", image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=100&q=70" },
      { name: "Fresh Milk", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100&q=70" },
    ],
  },
  {
    id: "ord-002",
    number: "FM-B8Y2M",
    date: "June 20, 2024",
    status: "DELIVERED",
    total: 67.80,
    itemCount: 8,
    items: [
      { name: "Sourdough Bread", image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=100&q=70" },
      { name: "Eggs", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&q=70" },
    ],
  },
  {
    id: "ord-003",
    number: "FM-C4P9N",
    date: "June 27, 2024",
    status: "OUT_FOR_DELIVERY",
    total: 28.20,
    itemCount: 3,
    items: [
      { name: "Cherry Tomatoes", image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=100&q=70" },
    ],
  },
];

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
  CONFIRMED: { label: "Confirmed", className: "bg-blue-100 text-blue-700" },
  PREPARING: { label: "Preparing", className: "bg-orange-100 text-orange-700" },
  OUT_FOR_DELIVERY: { label: "On the Way", className: "bg-purple-100 text-purple-700" },
  DELIVERED: { label: "Delivered", className: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-700" },
};

type Tab = "overview" | "orders" | "wishlist" | "addresses" | "settings";

const NAV_ITEMS: { key: Tab; label: string; icon: typeof ShoppingBag }[] = [
  { key: "overview", label: "Overview", icon: User },
  { key: "orders", label: "My Orders", icon: Package },
  { key: "wishlist", label: "Wishlist", icon: Heart },
  { key: "addresses", label: "Addresses", icon: MapPin },
  { key: "settings", label: "Settings", icon: Settings },
];

const STATS = [
  { label: "Total Orders", value: "12", icon: ShoppingBag, color: "text-primary-500", bg: "bg-primary-50" },
  { label: "Delivered", value: "10", icon: Package, color: "text-green-500", bg: "bg-green-50" },
  { label: "Wishlist Items", value: "8", icon: Heart, color: "text-red-500", bg: "bg-red-50" },
  { label: "Loyalty Points", value: "420", icon: Star, color: "text-yellow-500", bg: "bg-yellow-50" },
];

export function DashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="section-container py-6">
          <h1 className="text-2xl font-extrabold text-gray-900">My Account</h1>
        </div>
      </div>

      <div className="section-container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            {/* User Card */}
            <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <span className="text-lg font-bold text-primary-500">
                      {(session?.user?.name || "U")[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">
                    {session?.user?.name || "Guest"}
                  </p>
                  <p className="text-xs text-gray-400 truncate max-w-[140px]">
                    {session?.user?.email || ""}
                  </p>
                </div>
              </div>

              {/* Nav */}
              <nav className="space-y-1">
                {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                      activeTab === key
                        ? "bg-primary-50 text-primary-500"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {STATS.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="bg-white rounded-2xl shadow-sm p-4">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", stat.bg)}>
                          <Icon className={cn("w-5 h-5", stat.color)} />
                        </div>
                        <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-2xl shadow-sm p-5">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-bold text-gray-900">Recent Orders</h2>
                    <button onClick={() => setActiveTab("orders")} className="text-xs text-primary-500 font-semibold hover:underline">
                      View all
                    </button>
                  </div>
                  <div className="space-y-3">
                    {MOCK_ORDERS.slice(0, 2).map((order) => (
                      <div key={order.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="flex -space-x-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="relative w-9 h-9 rounded-lg overflow-hidden border-2 border-white">
                              <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </div>
                          ))}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">{order.number}</p>
                          <p className="text-xs text-gray-400">{order.date} • {order.itemCount} items</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm text-gray-900">{formatCurrency(order.total)}</p>
                          <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", STATUS_STYLES[order.status]?.className)}>
                            {STATUS_STYLES[order.status]?.label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ORDERS */}
            {activeTab === "orders" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold text-gray-900 mb-5">My Orders</h2>
                <div className="space-y-4">
                  {MOCK_ORDERS.map((order) => (
                    <div key={order.id} className="bg-white rounded-2xl shadow-sm p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="font-bold text-gray-900">{order.number}</p>
                          <p className="text-sm text-gray-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3.5 h-3.5" /> {order.date}
                          </p>
                        </div>
                        <span className={cn("text-xs px-2.5 py-1 rounded-full font-semibold", STATUS_STYLES[order.status]?.className)}>
                          {STATUS_STYLES[order.status]?.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-50">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                        ))}
                        {order.itemCount > order.items.length && (
                          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500">
                            +{order.itemCount - order.items.length}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                        <span className="text-sm text-gray-500">{order.itemCount} items</span>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-gray-900">{formatCurrency(order.total)}</span>
                          <Link
                            href={`/dashboard/orders/${order.id}`}
                            className="flex items-center gap-1 text-xs text-primary-500 font-semibold hover:underline"
                          >
                            Details <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* WISHLIST */}
            {activeTab === "wishlist" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold text-gray-900 mb-5">My Wishlist</h2>
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                  <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400">Your wishlist will appear here</p>
                  <Link href="/shop" className="btn-primary mt-4">Browse Products</Link>
                </div>
              </motion.div>
            )}

            {/* ADDRESSES */}
            {activeTab === "addresses" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold text-gray-900 mb-5">Saved Addresses</h2>
                <div className="bg-white rounded-2xl shadow-sm p-5">
                  <div className="p-4 border-2 border-dashed border-gray-200 rounded-2xl text-center cursor-pointer hover:border-primary-400 transition-colors">
                    <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Add a new delivery address</p>
                    <button className="btn-primary mt-3 text-sm py-2">+ Add Address</button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SETTINGS */}
            {activeTab === "settings" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold text-gray-900 mb-5">Account Settings</h2>
                <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                  {[
                    { label: "Full Name", value: session?.user?.name || "", placeholder: "Your name" },
                    { label: "Email Address", value: session?.user?.email || "", placeholder: "your@email.com", disabled: true },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {field.label}
                      </label>
                      <input
                        defaultValue={field.value}
                        disabled={field.disabled}
                        className="fm-input disabled:bg-gray-50 disabled:text-gray-400"
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                  <button className="btn-primary">Save Changes</button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
