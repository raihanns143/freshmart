"use client";

import { useState, useTransition, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingBag, Heart, MapPin, Settings, LogOut,
  Package, Clock, ChevronRight, Star, User, Lock, Edit3,
  Bell, Tag, MessageSquare, CheckCircle, AlertCircle, Activity
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/currency";
import { useSettings } from "@/context/SettingsContext";
import { toast } from "sonner";
import { updateUserProfile, changePassword } from "@/lib/actions/user";
import { EmptyState } from "@/components/ui/empty-state";

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
  CONFIRMED: { label: "Confirmed", className: "bg-blue-100 text-blue-700" },
  PREPARING: { label: "Preparing", className: "bg-orange-100 text-orange-700" },
  OUT_FOR_DELIVERY: { label: "On the Way", className: "bg-purple-100 text-purple-700" },
  DELIVERED: { label: "Delivered", className: "bg-blue-100 text-blue-700" },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-700" },
};

type Tab = "overview" | "orders" | "wishlist" | "addresses" | "reviews" | "coupons" | "notifications" | "activity" | "security" | "settings";

const NAV_ITEMS: { key: Tab; label: string; icon: any }[] = [
  { key: "overview", label: "Overview", icon: User },
  { key: "orders", label: "My Orders", icon: Package },
  { key: "wishlist", label: "Wishlist", icon: Heart },
  { key: "addresses", label: "Addresses", icon: MapPin },
  { key: "reviews", label: "Reviews", icon: Star },
  { key: "coupons", label: "Coupons", icon: Tag },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "activity", label: "My Activity", icon: Activity },
  { key: "security", label: "Security", icon: Lock },
  { key: "settings", label: "Settings", icon: Settings },
];

export function DashboardPage({ initialUser, activeCoupons = [] }: { initialUser: any; activeCoupons?: any[] }) {
  const searchParams = useSearchParams();
  const { settings } = useSettings();
  const tabParam = searchParams.get("tab") as Tab | null;
  
  const [activeTab, setActiveTab] = useState<Tab>(tabParam && NAV_ITEMS.some(n => n.key === tabParam) ? tabParam : "overview");
  
  useEffect(() => {
    if (tabParam && NAV_ITEMS.some(n => n.key === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(initialUser.name || "");
  const [phone, setPhone] = useState(initialUser.phone || "");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const handleUpdateProfile = () => {
    startTransition(async () => {
      const result = await updateUserProfile({ name, phone });
      if (result.success) toast.success("Profile updated");
      else toast.error(result.error || "Failed");
    });
  };

  const handleChangePassword = () => {
    if (!oldPass || !newPass) return toast.error("Please fill all fields");
    if (newPass !== confirmPass) return toast.error("New passwords do not match");
    if (newPass.length < 6) return toast.error("Password must be at least 6 characters");
    startTransition(async () => {
      const result = await changePassword(oldPass, newPass);
      if (result.success) {
        toast.success("Password changed successfully");
        setOldPass(""); setNewPass(""); setConfirmPass("");
      } else {
        toast.error(result.error || "Failed to change password");
      }
    });
  };

  const totalSpent = (initialUser.orders || []).reduce((sum: number, o: any) => sum + o.total, 0);
  const deliveredOrders = (initialUser.orders || []).filter((o: any) => o.status === "DELIVERED").length;
  const unreadNotifications = (initialUser.notifications || []).filter((n: any) => !n.read).length;

  const STATS = [
    { label: "Total Orders", value: (initialUser.orders || []).length, icon: ShoppingBag, color: "text-primary-500", bg: "bg-primary-50" },
    { label: "Total Spent", value: formatPrice(totalSpent, settings.activeCurrency), icon: Package, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Wishlist Items", value: (initialUser.wishlist || []).length, icon: Heart, color: "text-red-500", bg: "bg-red-50" },
    { label: "Reviews", value: (initialUser.reviews || []).length, icon: Star, color: "text-yellow-500", bg: "bg-yellow-50" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="section-container py-4 sm:py-6">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">My Account</h1>
        </div>
      </div>

      <div className="section-container py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5">
              {/* User Card */}
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {initialUser.image ? (
                    <Image src={initialUser.image} alt={initialUser.name || "User"} width={48} height={48} className="rounded-full object-cover" unoptimized />
                  ) : (
                    <span className="text-lg font-bold text-primary-500">{(initialUser.name || initialUser.email || "U")[0].toUpperCase()}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{initialUser.name || "Guest"}</p>
                  <p className="text-xs text-gray-400 truncate">{initialUser.email}</p>
                </div>
              </div>

              {/* Mobile: horizontal scroll tabs */}
              <div className="lg:hidden flex gap-1 overflow-x-auto pb-1 -mx-1 px-1">
                {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={cn(
                      "flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-all",
                      activeTab === key ? "bg-primary-50 text-primary-500" : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              {/* Desktop: vertical nav */}
              <nav className="hidden lg:block space-y-1">
                {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                      activeTab === key ? "bg-primary-50 text-primary-500" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="flex-1 text-left">{label}</span>
                    {key === "notifications" && unreadNotifications > 0 && (
                      <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{unreadNotifications}</span>
                    )}
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
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {STATS.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="bg-white rounded-2xl shadow-sm p-4">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", stat.bg)}>
                          <Icon className={cn("w-5 h-5", stat.color)} />
                        </div>
                        <p className="text-xl sm:text-2xl font-extrabold text-gray-900 truncate">{stat.value}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-gray-900">Recent Orders</h2>
                    <button onClick={() => setActiveTab("orders")} className="text-xs text-primary-500 font-semibold hover:underline">View all</button>
                  </div>
                  {(initialUser.orders || []).length === 0 ? (
                    <div className="text-center py-6">
                      <ShoppingBag className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No orders yet</p>
                      <Link href="/shop" className="text-primary-500 text-sm font-semibold hover:underline mt-1 inline-block">Start Shopping</Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(initialUser.orders || []).slice(0, 3).map((order: any) => (
                        <div key={order.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div className="flex -space-x-2">
                            {(order.items || []).slice(0, 3).map((item: any, idx: number) => (
                              <div key={item.id || idx} className="relative w-9 h-9 rounded-lg overflow-hidden border-2 border-white bg-white flex-shrink-0">
                                {item.product?.images?.[0] ? (
                                  <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" unoptimized />
                                ) : (
                                  <div className="w-full h-full bg-gray-200" />
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900">#{order.orderNumber}</p>
                            <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()} · {(order.items || []).length} items</p>
                          </div>
                          <div className="flex items-center gap-3 sm:block sm:text-right">
                            <p className="font-bold text-sm text-gray-900">{formatPrice(order.total, settings.activeCurrency)}</p>
                            <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", STATUS_STYLES[order.status]?.className || "bg-gray-100 text-gray-700")}>
                              {STATUS_STYLES[order.status]?.label || order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notifications preview */}
                {(initialUser.notifications || []).length > 0 && (
                  <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-bold text-gray-900 flex items-center gap-2">
                        Notifications
                        {unreadNotifications > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadNotifications}</span>}
                      </h2>
                      <button onClick={() => setActiveTab("notifications")} className="text-xs text-primary-500 font-semibold hover:underline">View all</button>
                    </div>
                    <div className="space-y-2">
                      {(initialUser.notifications || []).slice(0, 3).map((n: any) => (
                        <div key={n.id} className={cn("flex items-start gap-3 p-3 rounded-xl", n.read ? "bg-gray-50" : "bg-primary-50")}>
                          <Bell className={cn("w-4 h-4 mt-0.5 flex-shrink-0", n.read ? "text-gray-400" : "text-primary-500")} />
                          <div className="min-w-0">
                            <p className={cn("text-sm font-medium", n.read ? "text-gray-700" : "text-gray-900")}>{n.title}</p>
                            <p className="text-xs text-gray-500 truncate">{n.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ORDERS */}
            {activeTab === "orders" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-5">My Orders</h2>
                <div className="space-y-4">
                  {(initialUser.orders || []).length === 0 ? (
                    <EmptyState
                      icon={ShoppingBag}
                      title="No orders found"
                      description="You haven't placed any orders yet. Start shopping to discover fresh groceries."
                      primaryAction={{ label: "Start Shopping", href: "/shop" }}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100"
                    />
                  ) : (
                    (initialUser.orders || []).map((order: any) => (
                      <div key={order.id} className="bg-white rounded-2xl shadow-sm p-4 sm:p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-bold text-gray-900">#{order.orderNumber}</p>
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3.5 h-3.5" /> {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={cn("text-xs px-2.5 py-1 rounded-full font-semibold", STATUS_STYLES[order.status]?.className || "bg-gray-100 text-gray-700")}>
                            {STATUS_STYLES[order.status]?.label || order.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mb-4 overflow-x-auto">
                          {(order.items || []).map((item: any, idx: number) => (
                            <div key={item.id || idx} className="relative w-12 h-12 rounded-xl flex-shrink-0 overflow-hidden bg-gray-50 border border-gray-100">
                              {item.product?.images?.[0] && (
                                <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" unoptimized />
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-gray-100 pt-3 gap-2">
                          <span className="text-sm text-gray-500">{(order.items || []).length} items</span>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-gray-900">{formatPrice(order.total, settings.activeCurrency)}</span>
                            <Link
                              href={`/dashboard/orders/${order.id}`}
                              className="flex items-center gap-1 text-xs text-primary-500 font-semibold hover:underline bg-primary-50 px-3 py-1.5 rounded-lg"
                            >
                              Track Order <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* WISHLIST */}
            {activeTab === "wishlist" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-5">My Wishlist</h2>
                {(initialUser.wishlist || []).length === 0 ? (
                  <EmptyState
                    icon={Heart}
                    title="Your wishlist is empty"
                    description="Save items you love to your wishlist and buy them later."
                    primaryAction={{ label: "Browse Products", href: "/shop" }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100"
                  />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    {(initialUser.wishlist || []).map((item: any) => (
                      <Link
                        key={item.id}
                        href={`/product/${item.product?.slug}`}
                        className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
                      >
                        <div className="relative aspect-square bg-gray-50 rounded-xl mb-3 overflow-hidden">
                          {item.product?.images?.[0] && (
                            <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform" unoptimized />
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mb-1">{item.product?.category?.name}</p>
                        <p className="font-bold text-sm text-gray-900 line-clamp-1">{item.product?.name}</p>
                        <p className="font-extrabold text-gray-900 mt-1">{formatPrice(item.product?.price || 0, settings.activeCurrency)}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ADDRESSES */}
            {activeTab === "addresses" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-5">Saved Addresses</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {(initialUser.addresses || []).map((addr: any) => (
                    <div key={addr.id} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 relative">
                      {addr.isDefault && (
                        <span className="absolute top-4 right-4 bg-primary-100 text-primary-600 text-xs px-2 py-0.5 rounded-full font-bold">Default</span>
                      )}
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-primary-500" />
                        <h3 className="font-bold text-gray-900 text-sm uppercase">{addr.type}</h3>
                      </div>
                      <p className="font-medium text-sm text-gray-900">{addr.name}</p>
                      <p className="text-sm text-gray-500">{addr.phone}</p>
                      <p className="text-sm text-gray-500 mt-1">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                      <p className="text-sm text-gray-500">{addr.city}, {addr.state} {addr.zip}</p>
                      <p className="text-sm text-gray-500">{addr.country}</p>
                    </div>
                  ))}
                  <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-center min-h-[160px] border border-dashed border-gray-200 cursor-pointer hover:border-primary-400 transition-colors group">
                    <div className="text-center">
                      <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-primary-50 transition-colors">
                        <MapPin className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                      </div>
                      <p className="text-sm font-bold text-gray-700 group-hover:text-primary-500 transition-colors">Add New Address</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* REVIEWS */}
            {activeTab === "reviews" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-5">My Reviews</h2>
                {(initialUser.reviews || []).length === 0 ? (
                  <EmptyState
                    icon={Star}
                    title="No reviews yet"
                    description="You haven't reviewed any products yet. Share your experience to help others."
                    primaryAction={{ label: "Shop Now", href: "/shop" }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100"
                  />
                ) : (
                  <div className="space-y-4">
                    {(initialUser.reviews || []).map((review: any) => (
                      <div key={review.id} className="bg-white rounded-2xl shadow-sm p-4 sm:p-5">
                        <div className="flex items-start justify-between mb-3">
                          <Link href={`/product/${review.product?.slug}`} className="font-bold text-gray-900 hover:text-primary-500 transition-colors">
                            {review.product?.name || "Product"}
                          </Link>
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full font-medium",
                            review.status === "APPROVED" ? "bg-blue-100 text-blue-700" :
                            review.status === "REJECTED" ? "bg-red-100 text-red-700" :
                            "bg-yellow-100 text-yellow-700"
                          )}>
                            {review.status}
                          </span>
                        </div>
                        <div className="flex gap-1 mb-2">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} className={cn("w-4 h-4", s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200")} />
                          ))}
                        </div>
                        {review.title && <p className="font-semibold text-sm text-gray-900 mb-1">{review.title}</p>}
                        {review.comment && <p className="text-sm text-gray-600">{review.comment}</p>}
                        <p className="text-xs text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* COUPONS */}
            {activeTab === "coupons" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-5">Available Coupons</h2>
                {activeCoupons.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                    <Tag className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400">No active coupons available right now.</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {activeCoupons.map((coupon: any) => (
                      <div key={coupon.id} className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 border-l-4 border-primary-500">
                        <div className="flex justify-between items-start mb-2">
                          <span className="bg-primary-50 text-primary-700 font-bold px-3 py-1 rounded-lg tracking-wider text-sm">
                            {coupon.code}
                          </span>
                          <span className="text-lg font-bold text-gray-900">
                            {coupon.type === "PERCENTAGE" ? `${coupon.value}% OFF` : `${formatPrice(coupon.value, settings.activeCurrency)} OFF`}
                          </span>
                        </div>
                        {coupon.description && <p className="text-sm text-gray-600 mb-3">{coupon.description}</p>}
                        <div className="text-xs text-gray-400">
                          {coupon.minOrderAmount > 0 ? `Min. spend: ${formatPrice(coupon.minOrderAmount, settings.activeCurrency)}` : "No minimum spend"}
                          {coupon.expiresAt && ` • Expires: ${new Date(coupon.expiresAt).toLocaleDateString()}`}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* NOTIFICATIONS */}
            {activeTab === "notifications" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-5">Notifications</h2>
                {(initialUser.notifications || []).length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                    <Bell className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400">No notifications yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {(initialUser.notifications || []).map((n: any) => (
                      <div key={n.id} className={cn("flex items-start gap-3 p-4 rounded-2xl bg-white shadow-sm border", n.read ? "border-gray-100" : "border-primary-100")}>
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", n.read ? "bg-gray-100" : "bg-primary-50")}>
                          <Bell className={cn("w-4 h-4", n.read ? "text-gray-400" : "text-primary-500")} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-sm font-semibold", n.read ? "text-gray-700" : "text-gray-900")}>{n.title}</p>
                          <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                        </div>
                        {!n.read && <div className="w-2 h-2 bg-primary-500 rounded-full mt-1 flex-shrink-0" />}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ACTIVITY */}
            {activeTab === "activity" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-5">My Activity</h2>
                {(initialUser.auditLogs || []).length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-gray-100">
                    <Activity className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400">No activity yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(initialUser.auditLogs || []).map((log: any) => (
                      <div key={log.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                          <Activity className="w-5 h-5 text-primary-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                            <h3 className="font-semibold text-gray-900 truncate uppercase">
                              {log.action.replace(/_/g, " ")}
                            </h3>
                            <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-md w-fit">
                              {new Date(log.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {log.details || `Performed action on ${log.entity}`}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded text-blue-700 bg-blue-50 border border-blue-100">
                              {log.entity}
                            </span>
                            <span className={cn(
                              "text-[10px] uppercase font-bold px-2 py-0.5 rounded border",
                              log.status === "SUCCESS" ? "text-emerald-700 bg-emerald-50 border-emerald-100" :
                              log.status === "FAILED" ? "text-red-700 bg-red-50 border-red-100" :
                              "text-amber-700 bg-amber-50 border-amber-100"
                            )}>
                              {log.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* SECURITY */}
            {activeTab === "security" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-5">Security Settings</h2>
                <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 max-w-md">
                  {!initialUser.password ? (
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <p className="text-sm text-blue-700 font-medium flex items-center gap-2">
                        <Lock className="w-4 h-4 flex-shrink-0" />
                        You signed in with Google. Password changes are not available for social login accounts.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                        <input
                          type="password"
                          value={oldPass}
                          onChange={e => setOldPass(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500/50 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                        <input
                          type="password"
                          value={newPass}
                          onChange={e => setNewPass(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500/50 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                        <input
                          type="password"
                          value={confirmPass}
                          onChange={e => setConfirmPass(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500/50 outline-none"
                        />
                      </div>
                      <button
                        disabled={isPending}
                        onClick={handleChangePassword}
                        className="btn-primary w-full disabled:opacity-50"
                      >
                        {isPending ? "Updating..." : "Update Password"}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* SETTINGS */}
            {activeTab === "settings" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-5">Account Settings</h2>
                <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 max-w-xl space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-2">
                    <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {initialUser.image ? (
                        <Image src={initialUser.image} alt={initialUser.name || "User Avatar"} width={56} height={56} className="rounded-full object-cover" unoptimized />
                      ) : (
                        <span className="text-xl font-bold text-primary-500">{(initialUser.name || initialUser.email || "U")[0].toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{initialUser.name || "Not set"}</p>
                      <p className="text-sm text-gray-500">{initialUser.email}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500/50 outline-none"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                    <input
                      value={initialUser.email || ""}
                      disabled
                      className="w-full bg-gray-100 border border-gray-200 text-gray-500 rounded-xl px-4 py-2.5 text-sm outline-none cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                    <input
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500/50 outline-none"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <button
                    disabled={isPending}
                    onClick={handleUpdateProfile}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    <Edit3 className="w-4 h-4" />
                    {isPending ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Mobile logout button at bottom */}
            <div className="lg:hidden mt-6">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium text-red-500 bg-white shadow-sm hover:bg-red-50 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
