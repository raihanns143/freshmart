import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">404</h1>
        <h2 className="text-xl font-bold text-gray-700 mb-3">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-secondary transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/shop"
            className="border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:border-gray-300 transition-colors"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
