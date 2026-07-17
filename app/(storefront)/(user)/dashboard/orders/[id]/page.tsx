import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/currency";
import { ChevronLeft, Package, Truck, CheckCircle2, Clock, MapPin, CreditCard } from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS_STEPS = [
  { id: "PENDING", label: "Order Placed" },
  { id: "CONFIRMED", label: "Confirmed" },
  { id: "PREPARING", label: "Preparing" },
  { id: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { id: "DELIVERED", label: "Delivered" },
];

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/login");
  }

  const order = await prisma.order.findUnique({
    where: {
      id: params.id,
      userId: user.id,
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              slug: true,
              images: {
                take: 1,
                where: { isMain: true },
              },
            },
          },
        },
      },
      address: true,
    },
  });

  if (!order) {
    redirect("/dashboard?tab=orders");
  }

  const currentStatusIndex = STATUS_STEPS.findIndex((s) => s.id === order.status);
  
  // A generic currency fallback since we are doing this server-side and don't have SettingsContext
  const currency = { code: "BDT", symbol: "৳", exchangeRate: 1, decimalPlaces: 0 };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-white border-b">
        <div className="section-container py-4 sm:py-6">
          <Link href="/dashboard?tab=orders" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back to Orders
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Order #{order.orderNumber}</h1>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-primary-50 text-primary-600 px-3 py-1.5 rounded-lg text-sm font-bold">
                {STATUS_STEPS.find(s => s.id === order.status)?.label || order.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="section-container py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          <div className="flex-1 space-y-6">
            {/* Status Timeline */}
            <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Track Order</h2>
              <div className="relative">
                <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gray-100 -translate-x-1/2" />
                <div className="space-y-8 relative">
                  {STATUS_STEPS.map((step, idx) => {
                    const isCompleted = currentStatusIndex >= idx;
                    const isCurrent = currentStatusIndex === idx;
                    
                    return (
                      <div key={step.id} className="flex flex-row sm:flex-col items-center gap-4 sm:gap-2">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 ${
                          isCompleted ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
                        } ${isCurrent ? "ring-4 ring-primary-100" : ""}`}>
                          {idx === 0 && <Package className="w-5 h-5" />}
                          {idx === 1 && <CheckCircle2 className="w-5 h-5" />}
                          {idx === 2 && <Package className="w-5 h-5" />}
                          {idx === 3 && <Truck className="w-5 h-5" />}
                          {idx === 4 && <CheckCircle2 className="w-5 h-5" />}
                        </div>
                        <div className="sm:text-center">
                          <p className={`font-bold ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>{step.label}</p>
                          {isCurrent && <p className="text-xs text-primary-500 font-medium">Currently here</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Ordered Products</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-xl border border-gray-100">
                    <div className="relative w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                      {(item.product?.images?.[0] || item.image) ? (
                        <Image src={item.product?.images?.[0]?.url || item.image || ""} alt={item.name} fill className="object-cover" unoptimized />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <Link href={`/product/${item.product?.slug || "#"}`} className="font-bold text-gray-900 hover:text-primary-500 transition-colors line-clamp-1">
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                      <p className="font-bold text-gray-900 mt-2">{formatPrice(item.price, currency)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">{formatPrice(order.subtotal, currency)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-{formatPrice(order.discount, currency)}</span>
                  </div>
                )}
                {order.couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon</span>
                    <span className="font-medium">-{formatPrice(order.couponDiscount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="font-medium text-gray-900">{formatPrice(order.tax, currency)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">{formatPrice(order.shipping, currency)}</span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Grand Total</span>
                  <span className="text-xl font-extrabold text-primary-500">{formatPrice(order.total, currency)}</span>
                </div>
              </div>
            </div>

            {/* Payment & Shipping */}
            <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-100">
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                  <CreditCard className="w-4 h-4 text-gray-400" /> Payment Info
                </h3>
                <div className="text-sm">
                  <p className="text-gray-600 mb-1">Method: <span className="font-semibold text-gray-900">{order.paymentMethod === "COD" ? "Cash on Delivery" : order.paymentMethod}</span></p>
                  <p className="text-gray-600">Status: <span className={`font-semibold ${order.paymentStatus === "PAID" ? "text-green-600" : "text-yellow-600"}`}>{order.paymentStatus}</span></p>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-gray-400" /> Shipping Details
                </h3>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="font-semibold text-gray-900 mb-1">{order.shippingName}</p>
                  <p>{order.shippingPhone}</p>
                  <p className="mt-2">{order.shippingAddress}</p>
                  <p>{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
                  <p>{order.shippingCountry}</p>
                </div>
              </div>
            </div>
            
          </div>
          
        </div>
      </div>
    </div>
  );
}
