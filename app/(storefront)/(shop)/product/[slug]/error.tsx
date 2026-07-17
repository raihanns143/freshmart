"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Product page error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">Something went wrong!</h1>
        <p className="text-gray-500">
          We encountered an unexpected error while loading this product. Please try again or browse other products.
        </p>
        <div className="pt-8 flex flex-col gap-3">
          <button
            onClick={reset}
            className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-secondary transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/shop"
            className="w-full bg-white text-gray-700 font-bold py-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
