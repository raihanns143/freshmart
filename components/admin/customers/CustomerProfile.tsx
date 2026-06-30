"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, ShoppingBag, Star, Heart, MapPin,
  User, Mail, Phone, Calendar, Shield, Trash2
} from "lucide-react";
import { toast } from "sonner";
import { updateUserRole, deleteUser } from "@/lib/actions/admin";

const ROLES = ["USER", "EDITOR", "MANAGER", "ADMIN", "SUPER_ADMIN"];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-amber-400",
  CONFIRMED: "text-blue-400",
  DELIVERED: "text-emerald-400",
  CANCELLED: "text-red-400",
};

export function CustomerProfile({ customer }: { customer: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "reviews" | "wishlist">("orders");
  const [role, setRole] = useState(customer.role);

  const totalSpent = customer.orders.reduce((sum: number, o: any) => sum + o.total, 0);

  async function handleRoleChange(newRole: string) {
    setRole(newRole);
    startTransition(async () => {
      const result = await updateUserRole(customer.id, newRole);
      if (result.success) toast.success("Role updated");
      else toast.error(result.error ?? "Failed");
    });
  }

  async function handleDelete() {
    if (!confirm(`Delete customer ${customer.name ?? customer.email}? This cannot be undone.`)) return;
    startTransition(async () => {
      const result = await deleteUser(customer.id);
      if (result.success) {
        toast.success("Customer deleted");
        router.push("/admin/customers");
      } else {
        toast.error(result.error ?? "Failed to delete");
      }
    });
  }

  const tabs = [
    { key: "orders", label: "Orders", count: customer.orders.length },
    { key: "addresses", label: "Addresses", count: customer.addresses.length },
    { key: "reviews", label: "Reviews", count: customer.reviews.length },
    { key: "wishlist", label: "Wishlist", count: customer.wishlist.length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/customers"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">{customer.name ?? "Unnamed Customer"}</h1>
            <p className="text-slate-400 text-sm">{customer.email}</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm transition-colors border border-red-500/20"
        >
          <Trash2 className="w-4 h-4" />
          Delete Customer
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          {/* Stats */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total Orders", value: customer.orders.length, icon: ShoppingBag },
                { label: "Total Spent", value: `$${totalSpent.toFixed(2)}`, icon: ShoppingBag },
                { label: "Reviews", value: customer._count?.reviews ?? customer.reviews.length, icon: Star },
                { label: "Wishlist", value: customer._count?.wishlist ?? customer.wishlist.length, icon: Heart },
              ].map((stat) => (
                <div key={stat.label} className="bg-slate-800/50 rounded-xl p-3">
                  <p className="text-xs text-slate-400">{stat.label}</p>
                  <p className="text-lg font-bold text-white mt-0.5">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="font-semibold text-white text-sm">Account Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex gap-2 items-start">
                <Mail className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300 break-all">{customer.email}</span>
              </div>
              {customer.phone && (
                <div className="flex gap-2 items-center">
                  <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-slate-300">{customer.phone}</span>
                </div>
              )}
              <div className="flex gap-2 items-center">
                <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-slate-300">
                  Joined {new Date(customer.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Role Management */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-400" />
              Role
            </h3>
            <select
              value={role}
              onChange={(e) => handleRoleChange(e.target.value)}
              disabled={isPending}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tabs */}
          <div className="flex gap-1 bg-slate-800/50 rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-slate-700 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab.label}
                <span className="ml-1.5 text-xs opacity-70">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              {customer.orders.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>No orders yet</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      {["Order", "Items", "Total", "Status", "Date", ""].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {customer.orders.map((order: any) => (
                      <tr key={order.id} className="hover:bg-slate-800/50">
                        <td className="px-4 py-3 text-sm font-mono text-white">#{order.orderNumber}</td>
                        <td className="px-4 py-3 text-sm text-slate-400">{order._count.items}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-white">${order.total.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium ${STATUS_COLORS[order.status] ?? "text-slate-400"}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="text-xs text-emerald-400 hover:text-emerald-300"
                          >
                            View →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <div className="space-y-3">
              {customer.addresses.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
                  <MapPin className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>No addresses saved</p>
                </div>
              ) : (
                customer.addresses.map((addr: any) => (
                  <div key={addr.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-slate-400 capitalize font-medium uppercase">
                        {addr.type}
                      </span>
                      {addr.isDefault && (
                        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-white text-sm font-medium">{addr.name}</p>
                    <p className="text-slate-400 text-sm">{addr.phone}</p>
                    <p className="text-slate-400 text-sm">{addr.line1}</p>
                    {addr.line2 && <p className="text-slate-400 text-sm">{addr.line2}</p>}
                    <p className="text-slate-400 text-sm">
                      {addr.city}, {addr.state} {addr.zip}
                    </p>
                    <p className="text-slate-400 text-sm">{addr.country}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="space-y-3">
              {customer.reviews.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
                  <Star className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>No reviews yet</p>
                </div>
              ) : (
                customer.reviews.map((review: any) => (
                  <div key={review.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-1">
                      <Link href={`/product/${review.product?.slug ?? ""}`} className="text-sm text-white hover:text-emerald-400">
                        {review.product?.name}
                      </Link>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-600"}`} />
                        ))}
                      </div>
                    </div>
                    {review.title && <p className="text-sm font-medium text-white">{review.title}</p>}
                    <p className="text-sm text-slate-400">{review.comment}</p>
                    <div className="flex justify-between mt-2">
                      <span className={`text-xs font-medium ${review.status === "APPROVED" ? "text-emerald-400" : review.status === "REJECTED" ? "text-red-400" : "text-amber-400"}`}>
                        {review.status}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === "wishlist" && (
            <div className="grid grid-cols-2 gap-3">
              {customer.wishlist.length === 0 ? (
                <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
                  <Heart className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>Wishlist is empty</p>
                </div>
              ) : (
                customer.wishlist.map((item: any) => (
                  <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 overflow-hidden flex-shrink-0">
                      {item.product?.images?.[0]?.url && (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">{item.product?.name}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
