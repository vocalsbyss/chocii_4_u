"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Cake,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  Menu as MenuIcon,
  X,
  Bell,
  RefreshCw,
  Users,
  Activity,
  Megaphone,
  Tag,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<{ name: string; phone: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // Verify admin session on load
  useEffect(() => {
    // If currently on login page, skip verification redirect
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    fetch("/api/admin/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.admin) {
          setAdmin(data.admin);
        } else {
          router.push("/admin/login");
        }
      })
      .catch(() => {
        router.push("/admin/login");
      })
      .finally(() => setLoading(false));
  }, [pathname, router]);

  // Periodic polling for pending order badge
  useEffect(() => {
    if (pathname === "/admin/login") return;

    const fetchCounts = () => {
      fetch("/api/admin/orders?status=PENDING")
        .then((res) => res.json())
        .then((data) => {
          if (data.counts && data.counts.PENDING !== undefined) {
            setPendingCount(data.counts.PENDING);
          }
        })
        .catch(() => {});
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 6000);
    return () => clearInterval(interval);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cocoa-950 flex items-center justify-center text-cream-100">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-caramel-400 animate-spin mx-auto" />
          <p className="text-sm font-medium">Authenticating Admin Portal...</p>
        </div>
      </div>
    );
  }

  const navLinks = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/admin/orders",
      label: "Live Orders",
      icon: ShoppingBag,
      badge: pendingCount > 0 ? pendingCount : null,
    },
    {
      href: "/admin/traffic",
      label: "Traffic & Visitors",
      icon: Activity,
    },
    {
      href: "/admin/customers",
      label: "Customer Database",
      icon: Users,
    },
    {
      href: "/admin/broadcast",
      label: "Broadcast & Wishes",
      icon: Megaphone,
    },
    {
      href: "/admin/coupons",
      label: "Coupons & Discounts",
      icon: Tag,
    },
    {
      href: "/admin/products",
      label: "Menu & Desserts",
      icon: Cake,
    },
    {
      href: "/admin/settings",
      label: "Store Settings",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-cocoa-950 text-cream-100 flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-cocoa-900 border-r border-caramel-500/20 shrink-0 select-none">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/10 border border-caramel-500/30 flex items-center justify-center p-0.5 shrink-0">
            <Image
              src="/images/chocii-logo.png"
              alt="chocii 4 u logo"
              width={40}
              height={40}
              className="object-contain w-full h-full rounded-full"
            />
          </div>
          <div>
            <h2 className="text-base font-serif font-black tracking-wider text-cream-100 lowercase">
              chocii 4 u
            </h2>
            <span className="text-[10px] text-caramel-400 uppercase tracking-widest font-bold">
              Admin & Kitchen
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-caramel-500 text-cocoa-950 shadow-md shadow-caramel-500/20 font-bold"
                    : "text-cream-200/80 hover:bg-white/5 hover:text-cream-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? "bg-cocoa-950 text-caramel-300"
                        : "bg-strawberry-500 text-white animate-pulse"
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer with Customer Website Shortcut and Logout */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-cream-300/70 hover:text-caramel-400 hover:bg-white/5 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              View Customer Site
            </span>
          </Link>

          {admin && (
            <div className="px-3.5 py-2 text-[11px] text-cream-300/50">
              Logged in as <strong className="text-cream-100">{admin.name}</strong>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-strawberry-400 hover:bg-strawberry-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <div className="md:hidden bg-cocoa-900 border-b border-caramel-500/20 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white/10 border border-caramel-500/30 flex items-center justify-center p-0.5 shrink-0">
            <Image
              src="/images/chocii-logo.png"
              alt="chocii 4 u logo"
              width={32}
              height={32}
              className="object-contain w-full h-full rounded-full"
            />
          </div>
          <span className="font-serif font-black tracking-wider text-sm uppercase">
            Admin Panel
          </span>
        </div>

        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <span className="bg-strawberry-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-bounce">
              {pendingCount} New
            </span>
          )}
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 text-cream-200"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="md:hidden bg-cocoa-950 border-b border-caramel-500/30 p-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold ${
                  isActive
                    ? "bg-caramel-500 text-cocoa-950 font-bold"
                    : "text-cream-200 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="bg-strawberry-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs">
            <Link href="/" target="_blank" className="text-caramel-400">
              Customer Website ↗
            </Link>
            <button onClick={handleLogout} className="text-strawberry-400 font-semibold">
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Admin Content Viewport */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
