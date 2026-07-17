"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Package, User, MapPin, CreditCard,
  Truck, Clock, CheckCircle, XCircle, RotateCcw,
  Printer, Save, Edit2
} from "lucide-react";
import { toast } from "sonner";
import { updateOrder } from "@/lib/actions/admin";
import { useSettings } from "@/context/SettingsContext";
import { formatPrice } from "@/lib/currency";;

const ORDER_STATUSES = [
  "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED",
];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  CONFIRMED: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  PROCESSING: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  SHIPPED: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  DELIVERED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/30",
  REFUNDED: "bg-slate-500/10 text-slate-400 border-slate-500/30",
};

const TIMELINE_STEPS = [
  { status: "PENDING", label: "Order Placed", icon: Clock },
  { status: "CONFIRMED", label: "Confirmed", icon: CheckCircle },
  { status: "PROCESSING", label: "Processing", icon: Package },
  { status: "SHIPPED", label: "Shipped", icon: Truck },
  { status: "DELIVERED", label: "Delivered", icon: CheckCircle },
];

export function OrderDetail({ order }: { order: any }) {
  const router = useRouter();
  const { settings } = useSettings();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [notes, setNotes] = useState(order.notes ?? "");
  const [estimatedDelivery, setEstimatedDelivery] = useState(
    order.estimatedDelivery ? new Date(order.estimatedDelivery).toISOString().split("T")[0] : ""
  );

  const currentStepIndex = TIMELINE_STEPS.findIndex((s) => s.status === status);

  async function handleSave() {
    startTransition(async () => {
      const result = await updateOrder(order.id, {
        status,
        paymentStatus,
        notes,
        estimatedDelivery: estimatedDelivery || undefined,
      });
      if (result.success) {
        toast.success("Order updated successfully");
        router.refresh();
      } else {
        toast.error(result.error ?? "Failed to update order");
      }
    });
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Order #{order.orderNumber}
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Invoice
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-sm transition-colors font-medium"
          >
            <Save className="w-4 h-4" />
            {isPending ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Print Invoice Header */}
      <div className="hidden print:block text-center py-4 border-b">
        <h1 className="text-3xl font-bold text-black">FreshMart</h1>
        <p className="text-gray-500">Invoice #{order.orderNumber}</p>
        <p className="text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Timeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 print:hidden">
            <h2 className="font-semibold text-white mb-4">Order Timeline</h2>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-700" />
              <div className="space-y-4">
                {TIMELINE_STEPS.map((step, idx) => {
                  const isDone = idx <= currentStepIndex;
                  const Icon = step.icon;
                  return (
                    <div key={step.status} className="relative flex items-center gap-4 pl-8">
                      <div
                        className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                          isDone
                            ? "bg-emerald-500 border-emerald-500"
                            : "bg-slate-800 border-slate-600"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isDone ? "text-white" : "text-slate-500"}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isDone ? "text-white" : "text-slate-500"}`}>
                          {step.label}
                        </p>
                        {step.status === "DELIVERED" && order.deliveredAt && (
                          <p className="text-xs text-slate-400">
                            {new Date(order.deliveredAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800">
              <h2 className="font-semibold text-white">
                Items ({order.items.length})
              </h2>
            </div>
            <div className="divide-y divide-slate-800">
              {order.items.map((item: any) => (
                <div key={item.id} className="p-4 flex gap-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                    {item.product?.images?.[0]?.url ? (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <Package className="w-6 h-6 text-slate-500 m-3" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{item.name}</p>
                    {item.productVariant && (
                      <p className="text-xs text-slate-400">
                        {[item.productVariant.size, item.productVariant.color]
                          .filter(Boolean)
                          .join(" / ")}
                        {item.productVariant.sku && ` · SKU: ${item.productVariant.sku}`}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-semibold">
                      {formatPrice(item.total, settings.activeCurrency)}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatPrice(item.price, settings.activeCurrency)} × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="p-5 border-t border-slate-800 space-y-2">
              <div className="flex justify-between text-sm text-slate-400">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal, settings.activeCurrency)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-400">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount, settings.activeCurrency)}</span>
                </div>
              )}
              {order.couponDiscount > 0 && (
                <div className="flex justify-between text-sm text-emerald-400">
                  <span>Coupon {order.coupon?.code && `(${order.coupon.code})`}</span>
                  <span>-{formatPrice(order.couponDiscount, settings.activeCurrency)}</span>
                </div>
              )}
              {order.shipping > 0 && (
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Shipping</span>
                  <span>{formatPrice(order.shipping, settings.activeCurrency)}</span>
                </div>
              )}
              {order.tax > 0 && (
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Tax</span>
                  <span>{formatPrice(order.tax, settings.activeCurrency)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-semibold text-white border-t border-slate-700 pt-2">
                <span>Total</span>
                <span>{formatPrice(order.total, settings.activeCurrency)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Status Management */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 print:hidden">
            <h2 className="font-semibold text-white mb-4">Order Status</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Order Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  {["PENDING", "PAID", "FAILED", "REFUNDED", "PARTIALLY_REFUNDED"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Estimated Delivery</label>
                <input
                  type="date"
                  value={estimatedDelivery}
                  onChange={(e) => setEstimatedDelivery(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              Customer
            </h2>
            <div className="space-y-1">
              <p className="text-sm text-white">{order.user.name || "—"}</p>
              <p className="text-sm text-slate-400">{order.user.email}</p>
              {order.user.phone && (
                <p className="text-sm text-slate-400">{order.user.phone}</p>
              )}
            </div>
            <Link
              href={`/admin/customers/${order.user.id}`}
              className="mt-3 text-xs text-emerald-400 hover:text-emerald-300 transition-colors block"
            >
              View Customer Profile →
            </Link>
          </div>

          {/* Shipping Address */}
          {(order.shippingAddress || order.address) && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                Shipping Address
              </h2>
              <address className="text-sm text-slate-400 not-italic space-y-0.5">
                <p className="text-white">{order.shippingName || order.address?.name}</p>
                <p>{order.shippingPhone || order.address?.phone}</p>
                <p>{order.shippingAddress || order.address?.line1}</p>
                {(order.address?.line2) && <p>{order.address.line2}</p>}
                <p>
                  {order.shippingCity || order.address?.city},{" "}
                  {order.shippingState || order.address?.state}{" "}
                  {order.shippingZip || order.address?.zip}
                </p>
                <p>{order.shippingCountry || order.address?.country}</p>
              </address>
            </div>
          )}

          {/* Payment Info */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-400" />
              Payment
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Method</span>
                <span className="text-white">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Status</span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    order.paymentStatus === "PAID"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : order.paymentStatus === "FAILED"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-amber-500/10 text-amber-400"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
