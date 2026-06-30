"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye, Search, ChevronLeft, ChevronRight,
  Package, Clock, CheckCircle, XCircle, Truck
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  CONFIRMED: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  PROCESSING: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  SHIPPED: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  DELIVERED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/30",
  REFUNDED: "bg-slate-500/10 text-slate-400 border-slate-500/30",
};

const PAYMENT_COLORS: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-400",
  PAID: "bg-emerald-500/10 text-emerald-400",
  FAILED: "bg-red-500/10 text-red-400",
  REFUNDED: "bg-slate-500/10 text-slate-400",
};

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  createdAt: Date;
  user: { id: string; name: string | null; email: string };
  _count: { items: number };
}

export function OrdersTable({
  orders,
  total,
  page,
  pageSize,
  search,
  status,
  paymentStatus,
}: {
  orders: Order[];
  total: number;
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(search ?? "");
  const totalPages = Math.ceil(total / pageSize);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("search", q);
    if (status) params.set("status", status);
    router.push(`/admin/orders?${params}`);
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by order number, customer name or email..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm transition-colors font-medium"
          >
            Search
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              {["Order", "Customer", "Items", "Total", "Status", "Payment", "Date", ""].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>No orders found</p>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm text-white font-medium">
                      #{order.orderNumber}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm text-white">{order.user.name || "—"}</p>
                      <p className="text-xs text-slate-500">{order.user.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">
                    {order._count.items} item{order._count.items !== 1 ? "s" : ""}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-white">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        STATUS_COLORS[order.status] ?? "bg-slate-500/10 text-slate-400"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        PAYMENT_COLORS[order.paymentStatus] ?? ""
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-300 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-slate-800 flex items-center justify-between">
          <p className="text-sm text-slate-400">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
          </p>
          <div className="flex gap-2">
            <Link
              href={`/admin/orders?page=${page - 1}${status ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`}
              className={`p-2 rounded-lg text-sm transition-colors ${
                page <= 1
                  ? "opacity-40 pointer-events-none bg-slate-800"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <span className="px-3 py-2 text-sm text-slate-300">
              {page} / {totalPages}
            </span>
            <Link
              href={`/admin/orders?page=${page + 1}${status ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`}
              className={`p-2 rounded-lg text-sm transition-colors ${
                page >= totalPages
                  ? "opacity-40 pointer-events-none bg-slate-800"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
