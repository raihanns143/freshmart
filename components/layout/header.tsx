"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, User, Heart, Menu, X, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { CategoryNav } from "./category-nav";
import { useScrollToSection } from "@/hooks/use-scroll-to-section";
import { ShieldCheck } from "lucide-react";

export function Header({ categories = [] }: { categories?: any[] }) {
  const scrollToSpecialOffers = useScrollToSection("special-offers");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsAccountMenuOpen(false);
    };
    if (isAccountMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAccountMenuOpen]);
  
  const { itemCount: cartCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const wishlistCount = wishlistItems.length;
  const { isAuthenticated, user, login, logout } = useAuth();
  
  const isAdmin = user && ["SUPER_ADMIN", "ADMIN", "MANAGER", "EDITOR"].includes((user as any).role);

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
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
    }
  };
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-white shadow-sm border-b border-gray-100"
      )}
    >
      <div className="section-container relative z-20 px-0 lg:px-4 lg:max-w-7xl lg:mx-auto">
        
        {/* === MOBILE HEADER === */}
        <div className="flex lg:hidden items-center justify-between h-16 px-4 bg-white border-b border-gray-100">
          {/* Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 text-gray-700"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="FreshMart Logo"
              width={80}
              height={32}
              className="h-8 w-auto object-contain"
            />
          </Link>
          {/* Cart Icon with Red Badge */}
          <Link href="/cart" className="relative p-2 -mr-2">
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
        {/* === DESKTOP HEADER === */}
        <div className="hidden lg:flex items-center justify-between h-20 gap-8 px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="FreshMart Logo"
              width={100}
              height={40}
              className="h-10 w-auto object-contain"
            />
          </Link>
          {/* Desktop Search */}
          <div className="flex-1 max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all duration-200 border",
                  "bg-gray-50 border-gray-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-900"
                )}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors text-gray-400" />
            </form>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Wishlist */}
            <Link
              href="/dashboard?tab=wishlist"
              className="relative p-2 rounded-xl transition-colors text-gray-600 hover:bg-gray-50"
            >
              <Heart className="w-6 h-6" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
            {/* Account */}
            <div className="relative" ref={accountMenuRef}>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                    aria-expanded={isAccountMenuOpen}
                    aria-haspopup="true"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl transition-colors text-gray-600 hover:bg-gray-50"
                  >
                    {isAdmin ? (
                      <ShieldCheck className="w-5 h-5 text-red-600" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium">{user?.name?.split(" ")[0] || "Account"}</span>
                      {isAdmin && (
                        <span className="bg-red-100 text-red-700 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                          Admin
                        </span>
                      )}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {isAccountMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden py-1 z-50 origin-top-right"
                      >
                        <div className="px-4 py-2 border-b border-gray-50 mb-1">
                          <p className="text-sm font-semibold text-gray-900 truncate flex items-center gap-2">
                            {user?.name}
                            {isAdmin && (
                              <span className="bg-red-100 text-red-700 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                Admin
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        
                        {isAdmin ? (
                          <Link href="/admin/dashboard" onClick={() => setIsAccountMenuOpen(false)} className="block px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                            Admin Dashboard
                          </Link>
                        ) : (
                          <>
                            <Link href="/dashboard" onClick={() => setIsAccountMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                              Dashboard
                            </Link>
                            <Link href="/dashboard?tab=orders" onClick={() => setIsAccountMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                              My Orders
                            </Link>
                            <Link href="/dashboard?tab=wishlist" onClick={() => setIsAccountMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                              Wishlist
                            </Link>
                          </>
                        )}
                        
                        <div className="h-px bg-gray-100 my-1"></div>
                        <button
                          onClick={() => {
                            setIsAccountMenuOpen(false);
                            logout({ callbackUrl: "/" });
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <button
                  onClick={() => login()}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl transition-colors text-gray-600 hover:bg-gray-50"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">Sign In</span>
                </button>
              )}
            </div>
            {/* Cart */}
            <Link
              href="/cart"
              className="flex items-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="text-sm font-medium">Cart</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 bg-accent text-white text-xs font-bold flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
      {/* Category Nav - Only show on desktop when not in transparent mode, or always show if preferred. 
          The design says it's directly underneath the header. Let's make it solid. */}
      <div className="hidden lg:block border-b border-gray-100 transition-all duration-300 bg-white">
        <CategoryNav categories={categories} />
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
                  <Image
                    src="/logo.png"
                    alt="FreshMart Logo"
                    width={80}
                    height={32}
                    className="h-8 w-auto object-contain"
                  />
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
                  <button onClick={(e) => { setIsMobileMenuOpen(false); scrollToSpecialOffers(e as any); }} className="w-full flex items-center justify-between p-3 text-gray-700 hover:bg-primary/5 hover:text-primary rounded-xl font-medium transition-colors">
                    Special Offers
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                </nav>
                <div className="px-4 mt-6 mb-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Categories
                  </p>
                </div>
                <nav className="flex flex-col px-2">
                  {categories?.map((cat: any) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 text-gray-600 hover:bg-gray-50 rounded-xl text-sm font-medium transition-colors"
                    >
                      {cat.name}
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </Link>
                  ))}
                </nav>
              </div>
              
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold", isAdmin ? "bg-red-100 text-red-600" : "bg-primary/10 text-primary")}>
                        {user?.name?.charAt(0) || "U"}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          {user?.name}
                          {isAdmin && (
                            <span className="bg-red-100 text-red-700 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                              Admin
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {isAdmin ? (
                        <Link href="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="col-span-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg py-2 text-center hover:bg-red-100 transition-colors font-medium">Admin Dashboard</Link>
                      ) : (
                        <>
                          <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-gray-700 bg-white border border-gray-200 rounded-lg py-2 text-center hover:bg-gray-50 transition-colors">Dashboard</Link>
                          <Link href="/dashboard?tab=orders" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-gray-700 bg-white border border-gray-200 rounded-lg py-2 text-center hover:bg-gray-50 transition-colors">Orders</Link>
                          <Link href="/dashboard?tab=wishlist" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-gray-700 bg-white border border-gray-200 rounded-lg py-2 text-center hover:bg-gray-50 transition-colors">Wishlist</Link>
                        </>
                      )}
                      <button onClick={() => { setIsMobileMenuOpen(false); logout({ callbackUrl: "/" }); }} className="col-span-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg py-2 text-center hover:bg-red-100 font-medium transition-colors">Logout</button>
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