"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CreditCard, Truck, CheckCircle2, ChevronRight,
  ShoppingBag, MapPin, Phone, Mail,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/currency";;
import { toast } from "sonner";

const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().min(4, "ZIP code is required"),
  country: z.string().default("BD"),
  paymentMethod: z.enum(["COD"]),
  notes: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

type Step = "shipping" | "payment" | "review";

export function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shipping, tax, total, discount, couponCode, clearCart } = useCart();
  const [step, setStep] = useState<Step>("shipping");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: "COD", country: "BD" },
  });

  const paymentMethod = watch("paymentMethod");

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
          <Link href="/shop" className="btn-primary mt-4">Shop Now</Link>
        </div>
      </div>
    );
  }

  const handleNextStep = async () => {
    let valid = false;
    if (step === "shipping") {
      valid = await trigger(["firstName", "lastName", "email", "phone", "address", "city", "state", "zip"]);
      if (valid) setStep("payment");
    } else if (step === "payment") {
      setStep("review");
    }
  };

  const onSubmit = async (data: CheckoutForm) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          })),
          shippingAddress: {
            name: `${data.firstName} ${data.lastName}`,
            line1: data.address,
            city: data.city,
            state: data.state,
            zip: data.zip,
            country: data.country,
          },
          couponCode: couponCode || null,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to create order");
      }

      const resData = await response.json();
      const num = resData.data.orderNumber;

      setOrderNumber(num);
      setOrderComplete(true);
      clearCart();
      toast.success("Order placed successfully!");
      // In production: router.push(`/checkout/success?order=${num}`)
    } catch (error: any) {
      toast.error(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-card p-10 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary-500" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Order Placed!</h1>
          <p className="text-gray-500 mb-4">
            Thank you for your order. We&apos;ll start preparing it right away.
          </p>
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <p className="text-xs text-gray-400 mb-1">Order Number</p>
            <p className="font-extrabold text-lg text-gray-900">{orderNumber}</p>
          </div>
          <p className="text-sm text-gray-400 mb-6">
            Estimated delivery: <span className="font-semibold text-gray-700">30 minutes</span>
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/dashboard/orders" className="btn-primary justify-center">
              Track Order
            </Link>
            <Link
              href="/shop"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const steps: { key: Step; label: string; icon: typeof Truck }[] = [
    { key: "shipping", label: "Shipping", icon: MapPin },
    { key: "payment", label: "Payment", icon: CreditCard },
    { key: "review", label: "Review", icon: CheckCircle2 },
  ];

  const stepIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="section-container py-6">
          <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-primary-500">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/cart" className="hover:text-primary-500">Cart</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-medium">Checkout</span>
          </nav>
          {/* Step Indicator */}
          <div className="flex items-center gap-0">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const active = s.key === step;
              const done = idx < stepIndex;
              return (
                <div key={s.key} className="flex items-center">
                  <div
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all",
                      active
                        ? "bg-primary-500 text-white"
                        : done
                        ? "bg-primary-100 text-primary-500"
                        : "text-gray-400"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:block">{s.label}</span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={cn(
                        "w-8 h-0.5 mx-1 rounded",
                        idx < stepIndex ? "bg-primary-500" : "bg-gray-200"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="section-container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {/* STEP 1: Shipping */}
                {step === "shipping" && (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-3xl shadow-sm p-6"
                  >
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary-500" />
                      Shipping Information
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          First Name *
                        </label>
                        <input
                          {...register("firstName")}
                          className={cn("fm-input", errors.firstName && "border-red-400")}
                          placeholder="John"
                        />
                        {errors.firstName && (
                          <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Last Name *
                        </label>
                        <input
                          {...register("lastName")}
                          className={cn("fm-input", errors.lastName && "border-red-400")}
                          placeholder="Doe"
                        />
                        {errors.lastName && (
                          <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          <Mail className="w-3.5 h-3.5 inline mr-1" /> Email *
                        </label>
                        <input
                          {...register("email")}
                          type="email"
                          className={cn("fm-input", errors.email && "border-red-400")}
                          placeholder="john@example.com"
                        />
                        {errors.email && (
                          <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          <Phone className="w-3.5 h-3.5 inline mr-1" /> Phone *
                        </label>
                        <input
                          {...register("phone")}
                          type="tel"
                          className={cn("fm-input", errors.phone && "border-red-400")}
                          placeholder="+1 (555) 000-0000"
                        />
                        {errors.phone && (
                          <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                        )}
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Street Address *
                        </label>
                        <input
                          {...register("address")}
                          className={cn("fm-input", errors.address && "border-red-400")}
                          placeholder="123 Market Street"
                        />
                        {errors.address && (
                          <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
                        <input
                          {...register("city")}
                          className={cn("fm-input", errors.city && "border-red-400")}
                          placeholder="Fresh Valley"
                        />
                        {errors.city && (
                          <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          State *
                        </label>
                        <input
                          {...register("state")}
                          className={cn("fm-input", errors.state && "border-red-400")}
                          placeholder="CA"
                        />
                        {errors.state && (
                          <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          ZIP Code *
                        </label>
                        <input
                          {...register("zip")}
                          className={cn("fm-input", errors.zip && "border-red-400")}
                          placeholder="12345"
                        />
                        {errors.zip && (
                          <p className="text-xs text-red-500 mt-1">{errors.zip.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Order Notes (optional)
                        </label>
                        <textarea
                          {...register("notes")}
                          className="fm-input resize-none"
                          rows={2}
                          placeholder="Any delivery instructions..."
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Payment */}
                {step === "payment" && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-3xl shadow-sm p-6"
                  >
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-primary-500" />
                      Payment Method
                    </h2>
                    <div className="space-y-3">
                      {([
                        {
                          value: "COD",
                          label: "Cash on Delivery",
                          desc: "Pay when your order arrives",
                          icon: "💵",
                        },
                      ] as const).map((method) => (
                        <label
                          key={method.value}
                          className={cn(
                            "flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all",
                            paymentMethod === method.value
                              ? "border-primary-500 bg-primary-50"
                              : "border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <input
                            type="radio"
                            value={method.value}
                            {...register("paymentMethod")}
                            className="accent-[#2563EB]"
                          />
                          <span className="text-2xl">{method.icon}</span>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{method.label}</p>
                            <p className="text-xs text-gray-400">{method.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Review */}
                {step === "review" && (
                  <motion.div
                    key="review"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-3xl shadow-sm p-6"
                  >
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary-500" />
                      Review Your Order
                    </h2>
                    <div className="space-y-3 mb-6">
                      {items.map((item) => (
                        <div key={item.productId} className="flex items-center gap-3">
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                            <Image
                              src={item.product.images?.[0]?.url || ""}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              Qty: {item.quantity} × {formatPrice(item.product.price)}
                            </p>
                          </div>
                          <span className="font-semibold text-sm text-gray-900">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="font-medium">{formatPrice(subtotal)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-500">Discount ({couponCode})</span>
                          <span className="text-blue-500 font-medium">-{formatPrice(discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Shipping</span>
                        <span className={cn("font-medium", shipping === 0 ? "text-blue-500" : "")}>
                          {shipping === 0 ? "Free" : formatPrice(shipping)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Tax</span>
                        <span className="font-medium">{formatPrice(tax)}</span>
                      </div>
                      <div className="flex justify-between text-base font-bold border-t border-gray-100 pt-3">
                        <span>Total</span>
                        <span className="text-xl">{formatPrice(total)}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-6">
                {step !== "shipping" ? (
                  <button
                    type="button"
                    onClick={() =>
                      setStep(step === "review" ? "payment" : "shipping")
                    }
                    className="px-6 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    ← Back
                  </button>
                ) : (
                  <Link href="/cart" className="px-6 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors">
                    ← Cart
                  </Link>
                )}

                {step !== "review" ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="btn-primary px-8 py-3 rounded-xl"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary px-8 py-3 rounded-xl disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Placing Order...
                      </span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Place Order
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="bg-white rounded-3xl shadow-sm p-5 h-fit sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-primary-500" />
                Order ({items.length} items)
              </h3>
              <div className="space-y-3 mb-4">
                {items.slice(0, 3).map((item) => (
                  <div key={item.productId} className="flex items-center gap-2.5">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                      <Image
                        src={item.product.images?.[0]?.url || ""}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-400">×{item.quantity}</p>
                    </div>
                    <span className="text-xs font-semibold text-gray-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-xs text-gray-400 text-center">
                    +{items.length - 3} more items
                  </p>
                )}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-500">Discount</span>
                    <span className="text-blue-500 font-medium">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className={cn("font-medium", shipping === 0 ? "text-blue-500" : "")}>
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between font-bold border-t border-gray-100 pt-3">
                  <span>Total</span>
                  <span className="text-lg">{formatPrice(total)}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-400 justify-center">
                <Truck className="w-3.5 h-3.5" />
                Estimated delivery: 30 minutes
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
