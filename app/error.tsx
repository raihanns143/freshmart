'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if available
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="bg-orange-50 text-orange-500 w-24 h-24 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Something went wrong!</h1>
      <p className="text-gray-600 mb-8 max-w-md text-center">
        We encountered an unexpected error while processing your request. Our technical team has been notified.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg mb-8">
        <button
          onClick={() => reset()}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <RotateCcw className="w-5 h-5" />
          Try Again
        </button>
        <Link href="/" className="flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm">
          <Home className="w-5 h-5" />
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
