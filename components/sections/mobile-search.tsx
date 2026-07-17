"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export function MobileSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="md:hidden px-4 py-3 bg-white border-b border-gray-100">
      <form onSubmit={handleSearch} className="w-full relative">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-lg outline-none focus:bg-gray-200 focus:ring-0 text-sm text-gray-900 placeholder:text-gray-500"
        />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      </form>
    </div>
  );
}
