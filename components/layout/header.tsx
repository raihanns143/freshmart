"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, User, Heart, Menu, X, ChevronRight } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { CategoryNav } from "./category-nav";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { itemCount: cartCount } = useCart();
  
  // Dummy wishlist count for now
  const wishlistCount = 0;
  const { isAuthenticated, user, login, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results (mock)
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-white lg:bg-transparent lg:text-white"
      )}
    >
      <div className="section-container relative z-20">
        <div className="flex items-center justify-between h-20 gap-4 lg:gap-8">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 text-gray-700"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight hidden sm:block">
              <span className={cn(
                "block text-xl font-bold leading-tight transition-colors",
                isScrolled ? "text-gray-900" : "text-gray-900 lg:text-white"
              )}>
                FreshMart
              </span>
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all duration-200 border",
                  isScrolled 
                    ? "bg-gray-50 border-gray-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-900"
                    : "bg-white/10 border-white/20 text-white placeholder-white/70 focus:bg-white focus:text-gray-900 focus:placeholder-gray-500"
                )}
              />
              <Search className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors",
                isScrolled ? "text-gray-400" : "text-white/70"
              )} />
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className={cn(
                "relative p-2 rounded-xl transition-colors hidden sm:block",
                isScrolled ? "text-gray-600 hover:bg-gray-50" : "text-gray-600 lg:text-white/90 lg:hover:bg-white/10"
              )}
            >
              <Heart className="w-6 h-6" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <div className="hidden sm:block">
              {isAuthenticated ? (
                <button
                  onClick={() => logout()}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl transition-colors",
                    isScrolled ? "text-gray-600 hover:bg-gray-50" : "text-gray-600 lg:text-white/90 lg:hover:bg-white/10"
                  )}
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">{user?.name?.split(" ")[0] || "Account"}</span>
                </button>
              ) : (
                <button
                  onClick={() => login()}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl transition-colors",
                    isScrolled ? "text-gray-600 hover:bg-gray-50" : "text-gray-600 lg:text-white/90 lg:hover:bg-white/10"
                  )}
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">Sign In</span>
                </button>
              )}
            </div>

            {/* Cart */}
            <Link
              href="/cart"
              className="flex items-center gap-2 bg-primary hover:bg-secondary text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-colors shadow-sm"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:block text-sm font-medium">Cart</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 bg-accent text-white text-xs font-bold flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search (Visible only on small screens) */}
        <div className="lg:hidden pb-4">
          <form onSubmit={handleSearch} className="w-full relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-primary text-sm text-gray-900"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </form>
        </div>
      </div>

      {/* Category Nav - Only show on desktop when not in transparent mode, or always show if preferred. 
          The design says it's directly underneath the header. Let's make it solid. */}
      <div className={cn(
        "hidden lg:block border-b border-gray-100 transition-all duration-300",
        isScrolled ? "bg-white" : "bg-white/95 backdrop-blur-md shadow-sm"
      )}>
        <CategoryNav />
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[70] shadow-2xl flex flex-col lg:hidden"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-bold text-gray-900">FreshMart</span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4">
                <div className="px-4 mb-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Menu
                  </p>
                </div>
                <nav className="flex flex-col px-2">
                  <Link href="/" className="flex items-center justify-between p-3 text-gray-700 hover:bg-primary/5 hover:text-primary rounded-xl font-medium transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                    Home
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                  <Link href="/shop" className="flex items-center justify-between p-3 text-gray-700 hover:bg-primary/5 hover:text-primary rounded-xl font-medium transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                    Shop All
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                  <Link href="/offers" className="flex items-center justify-between p-3 text-gray-700 hover:bg-primary/5 hover:text-primary rounded-xl font-medium transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                    Special Offers
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                </nav>

                <div className="px-4 mt-6 mb-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Categories
                  </p>
                </div>
                <nav className="flex flex-col px-2">
                  {["Fresh Produce", "Dairy & Eggs", "Meat & Seafood", "Bakery", "Frozen Foods"].map((cat) => (
                    <Link
                      key={cat}
                      href={`/category/${cat.toLowerCase().replace(" & ", "-").replace(" ", "-")}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 text-gray-600 hover:bg-gray-50 rounded-xl text-sm font-medium transition-colors"
                    >
                      {cat}
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </Link>
                  ))}
                </nav>
              </div>
              
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <button onClick={() => logout()} className="text-xs text-red-500 font-medium hover:underline">
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => { setIsMobileMenuOpen(false); login(); }} className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-900 px-4 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-gray-50 transition-all">
                    <User className="w-4 h-4" />
                    Sign In or Register
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
