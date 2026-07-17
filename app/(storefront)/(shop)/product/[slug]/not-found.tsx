import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">Product Not Found</h1>
        <p className="text-gray-500">
          We couldn&apos;t find the product you&apos;re looking for. It may have been removed, renamed, or is temporarily unavailable.
        </p>
        <div className="pt-8 flex flex-col gap-3">
          <Link
            href="/shop"
            className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-secondary transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="w-full bg-white text-gray-700 font-bold py-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
