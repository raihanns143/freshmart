"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
  ChevronDown,
  Leaf,
  Egg,
  Beef,
  ShoppingBag,
  Snowflake,
  Coffee,
  Cookie,
  Sparkles,
  Truck,
  Tag,
  LogOut,
  LayoutDashboard,
  Package,
  Settings,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn, debounce } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// ---------- NAV CATEGORIES ----------

const navCategories = [
  { label: "Fresh Produce", href: "/category/fresh-produce", icon: Leaf, color: "text-green-500" },
  { label: "Dairy & Eggs", href: "/category/dairy-eggs", icon: Egg, color: "text-yellow-500" },
  { label: "Meat & Seafood", href: "/category/meat-seafood", icon: Beef, color: "text-red-500" },
  { label: "Bakery", href: "/category/bakery", icon: ShoppingBag, color: "text-orange-400" },
  { label: "Frozen Foods", href: "/category/frozen-foods", icon: Snowflake, color: "text-blue-400" },
  { label: "Beverages", href: "/category/beverages", icon: Coffee, color: "text-amber-600" },
  { label: "Snacks", href: "/category/snacks", icon: Cookie, color: "text-pink-400" },
  { label: "Health & Beauty", href: "/category/health-beauty", icon: Heart, color: "text-pink-500" },
];

// ---------- SEARCH SUGGESTIONS ----------

const trendingSearches = [
  "Organic Bananas",
  "Fresh Milk",
  "Sourdough Bread",
  "Cherry Tomatoes",
  "Greek Yogurt",
  "Free Range Eggs",
  "Avocado",
  "Chicken Breast",
];

export function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Sticky scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search suggestions
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchSuggestions = useCallback(
    debounce((q: string) => {
      if (q.length < 2) {
        setSuggestions([]);
        return;
      }
      const filtered = trendingSearches.filter((s) =>
        s.toLowerCase().includes(q.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    }, 200),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    fetchSuggestions(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchFocused(false);
    }
  };

  const handleSuggestionClick = (s: string) => {
    setSearchQuery(s);
    router.push(`/search?q=${encodeURIComponent(s)}`);
    setSearchFocused(false);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-white transition-shadow duration-300",
        scrolled ? "shadow-md" : "shadow-sm border-b border-gray-100"
      )}
    >
      {/* ---- TOP BAR ---- */}
      <div className="bg-white">
        <div className="section-container">
          <div className="flex items-center gap-4 py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-10 h-10 bg-[#16c65b] rounded-xl flex items-center justify-center shadow-sm">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <span className="block text-xl font-800 text-[#16c65b] leading-tight">
                  FreshMart
                </span>
                <span className="block text-xs text-gray-400 font-400 leading-none">
                  Fresh & Fast
                </span>
              </div>
            </Link>

            {/* Search Bar */}
            <div ref={searchRef} className="flex-1 relative max-w-2xl mx-auto">
              <form onSubmit={handleSearchSubmit}>
                <div
                  className={cn(
                    "flex items-center gap-2 pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg transition-all duration-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 relative",
                  )}
                >
                  <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search for products, brands and more..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => setSearchFocused(true)}
                    className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-500 outline-none w-full"
                    aria-label="Search products"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSuggestions([]);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>

              {/* Search Dropdown */}
              <AnimatePresence>
                {searchFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  >
                    {/* Suggestions */}
                    {suggestions.length > 0 ? (
                      <div className="p-2">
                        {suggestions.map((s) => (
                          <button
                            key={s}
                            onClick={() => handleSuggestionClick(s)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 text-left transition-colors"
                          >
                            <Search className="w-3.5 h-3.5 text-gray-400" />
                            {s}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3">
                        <p className="text-xs font-600 text-gray-400 uppercase tracking-wide px-2 mb-2">
                          Trending Searches
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {trendingSearches.slice(0, 6).map((s) => (
                            <button
                              key={s}
                              onClick={() => handleSuggestionClick(s)}
                              className="px-3 py-1.5 bg-gray-100 hover:bg-primary-50 hover:text-primary-500 rounded-full text-xs text-gray-600 transition-colors"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Account */}
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() =>
                    session ? setUserMenuOpen((v) => !v) : router.push("/login")
                  }
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  aria-label="Account"
                  aria-expanded={userMenuOpen}
                >
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="Avatar"
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                  <span className="text-sm font-500 hidden sm:block">
                    {session ? session.user?.name?.split(" ")[0] : "Account"}
                  </span>
                  {session && (
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 transition-transform hidden sm:block",
                        userMenuOpen && "rotate-180"
                      )}
                    />
                  )}
                </button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {userMenuOpen && session && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="p-3 border-b border-gray-100">
                        <p className="font-bold text-sm text-gray-900 truncate">
                          {session.user?.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {session.user?.email}
                        </p>
                      </div>
                      <div className="p-1.5">
                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-primary-500" />
                          My Dashboard
                        </Link>
                        <Link
                          href="/dashboard/orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Package className="w-4 h-4 text-blue-500" />
                          My Orders
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-gray-400" />
                          Settings
                        </Link>
                        {(session.user as any)?.role === "ADMIN" && (
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-orange-500" />
                            Admin Panel
                          </Link>
                        )}
                      </div>
                      <div className="p-1.5 border-t border-gray-100">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            signOut({ callbackUrl: "/" });
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                aria-label={`Shopping cart (${itemCount} items)`}
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] min-h-[18px] bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-600 leading-none px-1">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="lg:hidden flex items-center px-2 py-2 rounded-xl text-gray-600 hover:bg-gray-50"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---- CATEGORY NAV BAR ---- */}
      <div className="bg-white border-b border-gray-100 hidden lg:block">
        <div className="section-container">
          <nav className="flex items-center gap-0" aria-label="Category navigation">
            {navCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="flex items-center gap-2 px-4 py-3 group cursor-pointer whitespace-nowrap"
                >
                  <Icon className={cn("w-5 h-5 group-hover:scale-110 transition-transform", cat.color)} />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{cat.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ---- MOBILE MENU ---- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden border-t border-gray-100 bg-white"
          >
            <nav className="section-container py-3 space-y-0.5">
              {navCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Icon className={cn("w-4 h-4", cat.color)} />
                    <span className="text-sm font-500">{cat.label}</span>
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
