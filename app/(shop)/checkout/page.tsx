"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, CheckCircle2, ChevronRight, CreditCard, Smartphone, Tag, Loader2, X } from "lucide-react";
import { toast } from "sonner";

type Step = "shipping" | "payment" | "confirmation";

interface ShippingForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const INITIAL_SHIPPING: ShippingForm = {
  firstName: "", lastName: "", email: "", phone: "",
  address: "", apartment: "", city: "", state: "", zip: "", country: "US",
};

interface AppliedCoupon {
  code: string;
  description: string | null;
  discount: number;
  type: string;
  value: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, total, clearCart } = useCart();
  const [step, setStep] = useState<Step>("shipping");
  const [shipping, setShipping] = useState<ShippingForm>(INITIAL_SHIPPING);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isCouponLoading, setIsCouponLoading] = useState(false);

  // Order value computations
  const couponDiscount = appliedCoupon?.discount ?? 0;
  const subtotalAfterCoupon = Math.max(0, total - couponDiscount);
  const tax = subtotalAfterCoupon * 0.08;
  const shippingFee = total > 50 || total === 0 ? 0 : 5.99;
  const finalTotal = subtotalAfterCoupon + tax + shippingFee;

  // Redirect to login if not authenticated
  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login?callbackUrl=/checkout");
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Please sign in to continue checkout.</p>
          <Link href="/login?callbackUrl=/checkout" className="bg-primary text-white px-6 py-3 rounded-xl font-bold">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code.");
      return;
    }
    setIsCouponLoading(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), subtotal: total }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Invalid coupon code.");
      } else {
        setAppliedCoupon(data);
        toast.success(`Coupon applied! You save $${data.discount.toFixed(2)}`);
      }
    } catch {
      toast.error("Failed to validate coupon. Please try again.");
    } finally {
      setIsCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.info("Coupon removed.");
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const required: (keyof ShippingForm)[] = ["firstName", "lastName", "email", "address", "city", "state", "zip"];
    const missing = required.filter((k) => !shipping[k].trim());
    if (missing.length > 0) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
          couponCode: appliedCoupon?.code || null,
          shippingAddress: {
            name: `${shipping.firstName} ${shipping.lastName}`,
            line1: shipping.address,
            city: shipping.city,
            state: shipping.state,
            zip: shipping.zip,
          },
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Order placement failed.");
      }

      const data = await res.json();
      setOrderNumber(data.data.orderNumber);
      clearCart();
      setStep("confirmation");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (items.length === 0 && step !== "confirmation") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <Link href="/shop" className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-secondary transition-colors">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="section-container max-w-6xl">

        {/* Step Indicator */}
        {step !== "confirmation" && (
          <div className="flex items-center justify-center gap-2 mb-12">
            {(["shipping", "payment"] as Step[]).map((s, i) => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  step === s ? "bg-primary text-white shadow-sm" :
                  (step === "payment" && s === "shipping") ? "bg-green-50 text-green-700" : "bg-white text-gray-400 border border-gray-200"
                }`}>
                  {step === "payment" && s === "shipping" ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center text-xs">{i + 1}</span>
                  )}
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </div>
                {i < 1 && <ChevronRight className="w-4 h-4 text-gray-300" />}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* === STEP 1: SHIPPING === */}
        {step === "shipping" && (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-7/12">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h1 className="text-2xl font-800 text-gray-900 mb-8">Shipping Address</h1>
                <form id="shipping-form" onSubmit={handleShippingSubmit} noValidate>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        autoComplete="given-name"
                        value={shipping.firstName}
                        onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        autoComplete="family-name"
                        value={shipping.lastName}
                        onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={shipping.email}
                      onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      value={shipping.phone}
                      onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="address"
                      type="text"
                      autoComplete="street-address"
                      value={shipping.address}
                      onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                      placeholder="House number and street name"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="apartment" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Apartment, suite, unit (optional)
                    </label>
                    <input
                      id="apartment"
                      type="text"
                      autoComplete="address-line2"
                      value={shipping.apartment}
                      onChange={(e) => setShipping({ ...shipping, apartment: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="col-span-3 sm:col-span-1">
                      <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="city"
                        type="text"
                        autoComplete="address-level2"
                        value={shipping.city}
                        onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="state"
                        type="text"
                        autoComplete="address-level1"
                        value={shipping.state}
                        onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="zip" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        ZIP Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="zip"
                        type="text"
                        autoComplete="postal-code"
                        value={shipping.zip}
                        onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-white h-14 rounded-xl font-bold text-lg hover:bg-secondary active:scale-[0.98] transition-all shadow-sm mt-4"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <OrderSummary
              items={items}
              total={total}
              tax={tax}
              shippingFee={shippingFee}
              finalTotal={finalTotal}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              appliedCoupon={appliedCoupon}
              couponDiscount={couponDiscount}
              isCouponLoading={isCouponLoading}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
            />
          </div>
        )}

        {/* === STEP 2: PAYMENT === */}
        {step === "payment" && (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-7/12">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-800 text-gray-900 mb-8">Payment Method</h2>

                {/* Method Selector */}
                <div className="flex gap-4 mb-8">
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`flex-1 flex items-center gap-3 border-2 rounded-xl p-4 transition-all ${
                      paymentMethod === "card" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
                    }`}
                    aria-pressed={paymentMethod === "card"}
                  >
                    <CreditCard className={`w-5 h-5 ${paymentMethod === "card" ? "text-primary" : "text-gray-500"}`} />
                    <span className={`font-semibold text-sm ${paymentMethod === "card" ? "text-primary" : "text-gray-700"}`}>
                      Credit / Debit Card
                    </span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("paypal")}
                    className={`flex-1 flex items-center gap-3 border-2 rounded-xl p-4 transition-all ${
                      paymentMethod === "paypal" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
                    }`}
                    aria-pressed={paymentMethod === "paypal"}
                  >
                    <Smartphone className={`w-5 h-5 ${paymentMethod === "paypal" ? "text-primary" : "text-gray-500"}`} />
                    <span className={`font-semibold text-sm ${paymentMethod === "paypal" ? "text-primary" : "text-gray-700"}`}>
                      PayPal / Wallet
                    </span>
                  </button>
                </div>

                {/* Mock Stripe Card Fields */}
                {paymentMethod === "card" && (
                  <div className="flex flex-col gap-4 mb-6">
                    <div>
                      <label htmlFor="cardName" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Cardholder Name
                      </label>
                      <input
                        id="cardName"
                        type="text"
                        autoComplete="cc-name"
                        placeholder="John Smith"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          id="cardNumber"
                          type="text"
                          autoComplete="cc-number"
                          placeholder="4242 4242 4242 4242"
                          maxLength={19}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all tracking-wider"
                        />
                        <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="cardExpiry" className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Expiry Date
                        </label>
                        <input
                          id="cardExpiry"
                          type="text"
                          autoComplete="cc-exp"
                          placeholder="MM / YY"
                          maxLength={7}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        />
                      </div>
                      <div>
                        <label htmlFor="cardCvc" className="block text-sm font-semibold text-gray-700 mb-1.5">
                          CVC
                        </label>
                        <input
                          id="cardCvc"
                          type="text"
                          autoComplete="cc-csc"
                          placeholder="123"
                          maxLength={4}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "paypal" && (
                  <div className="py-12 text-center bg-gray-50 rounded-xl border border-gray-100 mb-6">
                    <p className="text-gray-500 text-sm mb-2">You will be redirected to PayPal to complete your payment securely.</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <button
                    onClick={() => setStep("shipping")}
                    className="w-full sm:w-auto px-8 py-4 border-2 border-gray-200 rounded-xl text-gray-700 font-bold hover:border-gray-300 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                    className="w-full flex-1 bg-primary text-white h-14 rounded-xl font-bold text-lg hover:bg-secondary active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <Lock className="w-5 h-5" />
                    {isPlacingOrder ? "Placing Order…" : `Place Order · $${finalTotal.toFixed(2)}`}
                  </button>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span>All transactions are encrypted and secured with SSL</span>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <OrderSummary
              items={items}
              total={total}
              tax={tax}
              shippingFee={shippingFee}
              finalTotal={finalTotal}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              appliedCoupon={appliedCoupon}
              couponDiscount={couponDiscount}
              isCouponLoading={isCouponLoading}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
            />
          </div>
        )}

        {/* === STEP 3: CONFIRMATION === */}
        {step === "confirmation" && (
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-3xl font-800 text-gray-900 mb-3">Order Placed!</h1>
            <p className="text-gray-500 mb-2">
              Thank you for shopping with FreshMart.
            </p>
            {orderNumber && (
              <p className="text-lg font-bold text-gray-900 mb-8">
                Order Reference: <span className="text-primary">{orderNumber}</span>
              </p>
            )}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-6 mb-8 text-left">
              <p className="text-sm text-gray-600">
                You&apos;ll receive a confirmation email at <span className="font-bold text-gray-900">{shipping.email}</span> with your order details and live tracking information.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard/customer" className="flex-1 border-2 border-gray-200 text-gray-700 px-6 py-4 rounded-xl font-bold hover:border-gray-300 transition-all">
                View My Orders
              </Link>
              <Link href="/shop" className="flex-1 bg-primary text-white px-6 py-4 rounded-xl font-bold hover:bg-secondary transition-all">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ─── Inline Order Summary Component ─── */
function OrderSummary({
  items, total, tax, shippingFee, finalTotal,
  couponCode, setCouponCode, appliedCoupon, couponDiscount,
  isCouponLoading, onApplyCoupon, onRemoveCoupon,
}: {
  items: any[];
  total: number;
  tax: number;
  shippingFee: number;
  finalTotal: number;
  couponCode: string;
  setCouponCode: (v: string) => void;
  appliedCoupon: AppliedCoupon | null;
  couponDiscount: number;
  isCouponLoading: boolean;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
}) {
  return (
    <div className="w-full lg:w-5/12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 sticky top-24">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

        {/* Items */}
        <div className="flex flex-col gap-4 mb-6 max-h-64 overflow-y-auto pr-1">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="w-14 h-14 flex-shrink-0 bg-gray-50 rounded-xl border border-gray-100 p-1">
                {item.images?.[0] ? (
                  <img src={item.images[0].url} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-lg" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-bold text-gray-900 flex-shrink-0">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Coupon Code Input */}
        <div className="mb-6">
          {appliedCoupon ? (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <Tag className="w-4 h-4 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-bold text-green-700">{appliedCoupon.code}</p>
                <p className="text-xs text-green-600">{appliedCoupon.description || `${appliedCoupon.type === "PERCENTAGE" ? `${appliedCoupon.value}% off` : `$${appliedCoupon.value} off`}`}</p>
              </div>
              <button onClick={onRemoveCoupon} className="text-green-500 hover:text-red-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Coupon code (e.g. WELCOME20)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && onApplyCoupon()}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              <button
                onClick={onApplyCoupon}
                disabled={isCouponLoading}
                className="bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-700 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {isCouponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
              </button>
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="border-t border-gray-100 pt-6 flex flex-col gap-3">
          <div className="flex justify-between text-gray-600 text-sm">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          {couponDiscount > 0 && (
            <div className="flex justify-between text-green-600 text-sm font-semibold">
              <span>Coupon Discount ({appliedCoupon?.code})</span>
              <span>−${couponDiscount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600 text-sm">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600 text-sm">
            <span>Shipping</span>
            <span>{shippingFee === 0 ? <span className="text-green-600 font-semibold">Free</span> : `$${shippingFee.toFixed(2)}`}</span>
          </div>
          {couponDiscount > 0 && (
            <div className="flex justify-between text-sm text-gray-500 line-through">
              <span>Original Total</span>
              <span>${(total + tax + shippingFee).toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-gray-100 pt-4 flex justify-between items-end">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-3xl font-900 text-gray-900">${finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
