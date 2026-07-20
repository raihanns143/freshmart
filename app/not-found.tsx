import Link from 'next/link';
import { Metadata } from 'next';
import { AlertCircle, Search, Home, ShoppingBag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="bg-red-50 text-red-500 w-24 h-24 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-8 max-w-md text-center">
        Sorry, we couldn&apos;t find the page you were looking for. It might have been moved, renamed, or no longer exists.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg mb-8">
        <Link href="/" className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <Home className="w-5 h-5" />
          Back to Homepage
        </Link>
        <Link href="/search" className="flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm">
          <Search className="w-5 h-5" />
          Search Products
        </Link>
      </div>
      
      <div className="text-center">
        <p className="text-sm font-medium text-gray-500 mb-4">POPULAR CATEGORIES</p>
        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/category/fresh-vegetables" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
            Fresh Vegetables
          </Link>
          <Link href="/category/fresh-fish" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
            Fresh Fish
          </Link>
          <Link href="/category/meat-poultry" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
            Meat & Poultry
          </Link>
          <Link href="/category/dairy-eggs" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
            Dairy & Eggs
          </Link>
        </div>
      </div>
    </div>
  );
}
