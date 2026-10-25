"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, User, Menu as MenuIcon, X, ArrowRight, Shield, Sparkles, LogOut } from "lucide-react";
import { getStoredCart } from "@/lib/cart";
import ThemeToggle from "@/components/theme/ThemeToggle";

// Official WhatsApp Icon SVG
function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 448 512"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
    </svg>
  );
}

interface NavbarProps {
  onOpenCart?: () => void;
}

export default function Navbar({ onOpenCart }: NavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [customer, setCustomer] = useState<{ name: string; phone: string; email?: string } | null>(null);

  // Update cart count and listen for changes
  useEffect(() => {
    const updateCount = () => {
      const items = getStoredCart();
      const count = items.reduce((acc, curr) => acc + curr.quantity, 0);
      setCartCount(count);
    };

    updateCount();
    window.addEventListener("cravings_cart_updated", updateCount);
    return () => window.removeEventListener("cravings_cart_updated", updateCount);
  }, []);

  // Check customer session with instant localStorage caching & live event syncing
  useEffect(() => {
    // 1. Immediately read from localStorage for instant display (no flash of "Sign In")
    try {
      const cached = localStorage.getItem("cravings_customer_user");
      if (cached) {
        setCustomer(JSON.parse(cached));
      }
    } catch {}

    const syncAuth = () => {
      fetch("/api/auth/me")
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated && data.user) {
            setCustomer(data.user);
            try {
              localStorage.setItem("cravings_customer_user", JSON.stringify(data.user));
            } catch {}
          } else {
            setCustomer(null);
            try {
              localStorage.removeItem("cravings_customer_user");
            } catch {}
          }
        })
        .catch(() => {});
    };

    syncAuth();

    const handleAuthChanged = (e: any) => {
      if (e?.detail) {
        setCustomer(e.detail);
      } else {
        syncAuth();
      }
    };

    window.addEventListener("cravings_auth_changed", handleAuthChanged);
    return () => window.removeEventListener("cravings_auth_changed", handleAuthChanged);
  }, [pathname]);

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide customer navbar on admin routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 font-sans ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-[#EADCCE] py-3.5 shadow-sm text-cocoa-950"
            : "bg-white/85 backdrop-blur-sm border-b border-[#EADCCE]/40 py-4 text-cocoa-950"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-8 lg:px-14 flex items-center justify-between">
          {/* Brand Wordmark & Rounded Logo: chocii 4 u */}
          <Link href="/" className="group flex items-center gap-1.5 sm:gap-2.5 shrink min-w-0">
            <div className="relative h-9 w-11 sm:h-11 sm:w-14 rounded-full overflow-hidden bg-caramel-50/70 border border-caramel-500/30 shadow-xs flex items-center justify-center p-0.5 group-hover:scale-105 group-hover:border-caramel-500/60 transition-all shrink-0">
              <Image
                src="/images/chocii-logo.png"
                alt="chocii 4 u logo"
                width={80}
                height={50}
                className="object-contain w-full h-full rounded-full"
                priority
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-base sm:text-xl font-serif font-black tracking-wider text-cocoa-950 group-hover:text-caramel-600 transition-colors leading-none lowercase truncate">
                chocii 4 u
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono tracking-wider sm:tracking-widest text-caramel-600 uppercase leading-none mt-1 truncate">
                A Little Treat, Just for You
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/"
              className={`text-xs uppercase tracking-[0.2em] font-semibold transition-colors ${
                pathname === "/" ? "text-caramel-600" : "text-cocoa-900/80 hover:text-caramel-600"
              }`}
            >
              EXPERIENCE
            </Link>
            <Link
              href="/#full-menu-section"
              className={`text-xs uppercase tracking-[0.2em] font-semibold transition-colors ${
                pathname === "/menu" ? "text-caramel-600" : "text-cocoa-900/80 hover:text-caramel-600"
              }`}
            >
              MENU
            </Link>
            <Link
              href="/about"
              className={`text-xs uppercase tracking-[0.2em] font-semibold transition-colors ${
                pathname === "/about" ? "text-caramel-600" : "text-cocoa-900/80 hover:text-caramel-600"
              }`}
            >
              STORY
            </Link>
            <Link
              href="/contact"
              className={`text-xs uppercase tracking-[0.2em] font-semibold transition-colors ${
                pathname === "/contact" ? "text-caramel-600" : "text-cocoa-900/80 hover:text-caramel-600"
              }`}
            >
              CONTACT
            </Link>
            <Link
              href="/#feedback-section"
              className={`text-xs uppercase tracking-[0.2em] font-semibold transition-colors ${
                pathname === "/feedback" ? "text-caramel-600" : "text-cocoa-900/80 hover:text-caramel-600"
              }`}
            >
              FEEDBACK
            </Link>
            <Link
              href="/faq"
              className={`text-xs uppercase tracking-[0.2em] font-semibold transition-colors ${
                pathname === "/faq" ? "text-caramel-600" : "text-cocoa-900/80 hover:text-caramel-600"
              }`}
            >
              FAQ
            </Link>
            <Link
              href="/track-order"
              className={`text-xs uppercase tracking-[0.2em] font-semibold transition-colors ${
                pathname === "/track-order" ? "text-caramel-600" : "text-cocoa-900/80 hover:text-caramel-600"
              }`}
            >
              TRACK LIVE
            </Link>
          </nav>

          {/* Action Buttons: WhatsApp, Cart, Auth */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* WhatsApp Quick Direct Button */}
            <a
              href="https://wa.me/918688367177"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-black font-bold text-xs px-3.5 py-1.5 rounded-full transition-transform active:scale-95 shadow-lg shadow-[#25D366]/20"
              title="Chat on WhatsApp"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-[11px] font-sans">WhatsApp</span>
            </a>

            {/* Customer Session / Sign In Button */}
            {customer ? (
              <div className="hidden sm:flex items-center gap-2 bg-cocoa-950/5 dark:bg-white/10 border border-[#EADCCE] dark:border-white/20 rounded-full px-3.5 py-1.5 text-xs text-cocoa-950 dark:text-cream-100 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold truncate max-w-[95px]">
                  {customer.name?.split(" ")[0] || "Account"}
                </span>
                <span className="text-stone-300 dark:text-stone-600">|</span>
                <Link
                  href="/orders"
                  className="text-caramel-600 dark:text-caramel-400 hover:text-caramel-700 font-bold uppercase text-[10px] tracking-wider"
                >
                  Orders
                </Link>
                <button
                  onClick={async () => {
                    await fetch("/api/auth/logout", { method: "POST" });
                    try {
                      localStorage.removeItem("cravings_customer_user");
                    } catch {}
                    setCustomer(null);
                    window.dispatchEvent(new CustomEvent("cravings_auth_changed", { detail: null }));
                    window.location.href = "/";
                  }}
                  className="text-stone-400 hover:text-strawberry-500 ml-0.5 p-0.5 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cocoa-950 dark:text-cream-100 hover:text-white bg-cocoa-950/5 dark:bg-white/10 hover:bg-cocoa-950 dark:hover:bg-caramel-600 border border-[#EADCCE] dark:border-white/20 px-3.5 py-1.5 rounded-full transition-all"
              >
                <User className="w-3 h-3 text-caramel-600 dark:text-caramel-400" />
                Sign In
              </Link>
            )}

            {/* Dark / Light Theme Toggle */}
            <ThemeToggle />

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 sm:p-2.5 rounded-full bg-cocoa-950/5 hover:bg-cocoa-950/10 border border-[#EADCCE] text-cocoa-950 transition-transform active:scale-95 shadow-sm"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-caramel-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-strawberry-600 text-white font-bold text-[10px] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center animate-bounce shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 text-cocoa-950 hover:text-caramel-600"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <MenuIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/98 backdrop-blur-2xl border-b border-[#EADCCE] px-6 py-6 mt-3 space-y-4 shadow-xl animate-in fade-in slide-in-from-top-2">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold tracking-wider uppercase text-cocoa-950 py-1.5 border-b border-[#EADCCE]/50"
              >
                Experience
              </Link>
              <Link
                href="/menu"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold tracking-wider uppercase text-cocoa-950 py-1.5 border-b border-[#EADCCE]/50"
              >
                Signature Desserts
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold tracking-wider uppercase text-cocoa-950 py-1.5 border-b border-[#EADCCE]/50"
              >
                Our Story & Craft
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold tracking-wider uppercase text-cocoa-950 py-1.5 border-b border-[#EADCCE]/50"
              >
                Contact & Cloud Hub
              </Link>
              <Link
                href="/feedback"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold tracking-wider uppercase text-cocoa-950 py-1.5 border-b border-[#EADCCE]/50"
              >
                Customer Feedback & 3D Reviews
              </Link>
              <Link
                href="/faq"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold tracking-wider uppercase text-cocoa-950 py-1.5 border-b border-[#EADCCE]/50"
              >
                FAQ & Dietary Info
              </Link>
              <Link
                href="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold tracking-wider uppercase text-cocoa-950 py-1.5 border-b border-[#EADCCE]/50"
              >
                Track Live Order
              </Link>
              {customer && (
                <Link
                  href="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold tracking-wider uppercase text-cocoa-950 py-1.5 border-b border-[#EADCCE]/50"
                >
                  My Order History
                </Link>
              )}
            </nav>

            <div className="pt-2 flex flex-col gap-2.5">
              {/* Mobile Theme Toggle Row */}
              <div className="flex items-center justify-between py-2 px-1 border-b border-[#EADCCE]/50 text-xs text-cocoa-900">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Theme (Dark / Light)</span>
                <ThemeToggle />
              </div>

              <a
                href="https://wa.me/918688367177"
                target="_blank"
                rel="noreferrer"
                className="w-full text-center py-2.5 rounded-full bg-[#25D366] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <WhatsAppIcon className="w-4 h-4" />
                Contact on WhatsApp
              </a>

              {customer ? (
                <div className="p-3.5 rounded-2xl bg-cocoa-950/5 dark:bg-white/5 border border-[#EADCCE] dark:border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-cocoa-900 dark:text-cream-100">
                    <span className="flex items-center gap-1.5 font-medium truncate max-w-[200px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      Signed in as <strong className="text-caramel-600 dark:text-caramel-400 ml-1">{customer.name}</strong>
                    </span>
                    <button
                      onClick={async () => {
                        await fetch("/api/auth/logout", { method: "POST" });
                        try {
                          localStorage.removeItem("cravings_customer_user");
                        } catch {}
                        setCustomer(null);
                        setMobileMenuOpen(false);
                        window.dispatchEvent(new CustomEvent("cravings_auth_changed", { detail: null }));
                        window.location.href = "/";
                      }}
                      className="text-strawberry-600 dark:text-strawberry-400 hover:underline font-bold text-xs shrink-0"
                    >
                      Logout
                    </button>
                  </div>
                  <Link
                    href="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center py-2 rounded-xl bg-cocoa-950 dark:bg-caramel-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm"
                  >
                    View My Orders
                  </Link>
                </div>
              ) : (
                <Link
                  href="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full bg-cocoa-950 dark:bg-caramel-600 text-white text-xs font-bold uppercase tracking-wider"
                >
                  Sign In with Email & Phone
                </Link>
              )}

              <div className="pt-2 text-center">
                <Link
                  href="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[11px] text-cocoa-900/50 hover:text-caramel-600 inline-flex items-center gap-1"
                >
                  <Shield className="w-3 h-3" /> Admin & Kitchen
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
