"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  RefreshCw,
  Send,
  Sparkles,
  ShoppingBag,
  IndianRupee,
  Calendar,
  Clock,
  MapPin,
  Check,
  Copy,
  ExternalLink,
  ChevronDown,
  Gift,
  Heart,
  Smile,
  AlertCircle,
  CheckCircle2,
  Phone,
  MessageCircle,
  X,
  Trash2,
  Megaphone,
} from "lucide-react";

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

interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  rawDigits: string;
  totalOrders: number;
  totalSpent: number;
  registeredAt: string;
  lastLoginAt: string;
  latestOrderDate: string | null;
  latestOrderNumber: string | null;
  latestOrderStatus: string | null;
  latestAddress: string | null;
  segment: "VIP" | "ACTIVE" | "NEW";
}

interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  totalRevenue: number;
  avgLtv: number;
  newThisWeek: number;
}

// Pre-configured broadcast templates
const BROADCAST_TEMPLATES = [
  {
    id: "offer_20",
    name: "Special 20% OFF Offer",
    icon: Gift,
    badge: "Exclusive Deal",
    text: `Hello {{name}}! 🍫✨\n\nExclusive treat for you from *chocii 4 u*!\n\nUse coupon code *CHOCII20* to enjoy *FLAT 20% OFF* on your favorite Dream Cake, Choco Churros & Brownie Bowls today!\n\n“A Little Treat, Just for You.” 🎂\n\nOrder now & indulge: https://chocii4u.com`,
  },
  {
    id: "festive_wishes",
    name: "Warm Sweet Wishes & Greetings",
    icon: Heart,
    badge: "Celebration",
    text: `Warm sweet greetings from *chocii 4 u*! 🍫✨\n\nDear {{name}}, wishing you and your loved ones moments filled with laughter, happiness, and rich delights!\n\nCelebrate your special moments with our artisanal chocolate creations.\n\n“A Little Treat, Just for You.” 💖\n\nExplore treats: https://chocii4u.com`,
  },
  {
    id: "weekend_craving",
    name: "Weekend Dessert Craving",
    icon: Sparkles,
    badge: "Weekend Treat",
    text: `Hey {{name}}! 🍨 Weekend dessert cravings sorted!\n\nTreat yourself and your friends to *chocii 4 u*'s molten Brownie Bowls and chilled Fruizy treats. Delivered fresh to your doorstep in Visakhapatnam!\n\n“A Little Treat, Just for You.” 🍫\n\nTap to order: https://chocii4u.com`,
  },
  {
    id: "welcome_appreciation",
    name: "Patron Appreciation & Welcome",
    icon: Smile,
    badge: "Appreciation",
    text: `Hello {{name}}! 👋\n\nThank you for being a cherished part of the *chocii 4 u* family.\n\n“A Little Treat, Just for You.” ✨\n\nWhenever you crave authentic artisanal desserts, our kitchen is always ready for you: https://chocii4u.com`,
  },
];

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [stats, setStats] = useState<CustomerStats>({
    totalCustomers: 0,
    activeCustomers: 0,
    totalRevenue: 0,
    avgLtv: 0,
    newThisWeek: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSegment, setSelectedSegment] = useState<string>("ALL");
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<Set<string>>(new Set());

  // Broadcast modal states
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState("offer_20");
  const [customMessage, setCustomMessage] = useState(BROADCAST_TEMPLATES[0].text);
  const [broadcastTargetCustomer, setBroadcastTargetCustomer] = useState<CustomerRecord | null>(null);
  const [sentCustomerIds, setSentCustomerIds] = useState<Set<string>>(new Set());
  const [copiedNumbers, setCopiedNumbers] = useState(false);

  // Fetch customer database
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (selectedSegment !== "ALL") params.set("segment", selectedSegment);

      const res = await fetch(`/api/admin/customers?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load customers");
      const data = await res.json();
      setCustomers(data.customers || []);
      if (data.stats) setStats(data.stats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [selectedSegment]);

  // Handle search with slight debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Multi-select handlers
  const handleSelectAll = () => {
    if (selectedCustomerIds.size === customers.length) {
      setSelectedCustomerIds(new Set());
    } else {
      setSelectedCustomerIds(new Set(customers.map((c) => c.id)));
    }
  };

  const handleToggleSelect = (id: string) => {
    const next = new Set(selectedCustomerIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedCustomerIds(next);
  };

  const handleDeleteCustomer = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete customer "${name}" and all their past test orders?`)) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/customers?id=${id}&deleteOrders=true`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete customer");
      }
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      selectedCustomerIds.delete(id);
      setSelectedCustomerIds(new Set(selectedCustomerIds));
      fetchCustomers();
    } catch (e: any) {
      alert(e.message || "Failed to delete customer");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSelectedCustomers = async () => {
    if (selectedCustomerIds.size === 0) return;
    if (
      !confirm(
        `Are you sure you want to delete ${selectedCustomerIds.size} selected customer records and their test orders?`
      )
    ) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/customers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerIds: Array.from(selectedCustomerIds),
          deleteOrders: true,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete selected customers");
      }
      alert(data.message || `Deleted ${selectedCustomerIds.size} customer records.`);
      setSelectedCustomerIds(new Set());
      fetchCustomers();
    } catch (e: any) {
      alert(e.message || "Failed to delete selected customers");
    } finally {
      setLoading(false);
    }
  };

  const handleClearTestCustomers = async () => {
    if (
      !confirm(
        "Clean all test and duplicate customer records? (Test accounts like Rohan Sharma and Quick Tester will be removed, preserving your genuine customers)."
      )
    ) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/customers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear_test", deleteOrders: true }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to clean test customers");
      }
      alert(data.message || "Test customer data successfully cleared!");
      fetchCustomers();
    } catch (e: any) {
      alert(e.message || "Failed to clean test customers");
    } finally {
      setLoading(false);
    }
  };

  // Build personalized WhatsApp URL for a customer
  const getWhatsAppUrl = (customer: CustomerRecord, templateText: string) => {
    const cleanDigits = customer.rawDigits;
    const phoneWithCountry = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;
    const personalized = templateText
      .replace(/{{name}}/g, customer.name === "Valued Guest" ? "there" : customer.name)
      .replace(/{{phone}}/g, customer.phone);
    return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(personalized)}`;
  };

  // Open individual WhatsApp broadcast modal
  const handleOpenIndividualWhatsApp = (customer: CustomerRecord) => {
    setBroadcastTargetCustomer(customer);
    const tmpl = BROADCAST_TEMPLATES.find((t) => t.id === selectedTemplateId) || BROADCAST_TEMPLATES[0];
    setCustomMessage(tmpl.text);
    setIsBroadcastOpen(true);
  };

  // Open bulk broadcast modal
  const handleOpenBulkBroadcast = () => {
    setBroadcastTargetCustomer(null);
    const tmpl = BROADCAST_TEMPLATES.find((t) => t.id === selectedTemplateId) || BROADCAST_TEMPLATES[0];
    setCustomMessage(tmpl.text);
    setIsBroadcastOpen(true);
  };

  // Copy all selected phone numbers for WhatsApp broadcast list
  const handleCopyPhoneNumbers = () => {
    const targetCustomers = broadcastTargetCustomer
      ? [broadcastTargetCustomer]
      : selectedCustomerIds.size > 0
      ? customers.filter((c) => selectedCustomerIds.has(c.id))
      : customers;

    const numbers = targetCustomers
      .map((c) => (c.rawDigits.length === 10 ? `+91 ${c.rawDigits}` : c.phone))
      .join(", ");

    navigator.clipboard.writeText(numbers);
    setCopiedNumbers(true);
    setTimeout(() => setCopiedNumbers(false), 3000);
  };

  // Customers targeted in current broadcast modal
  const broadcastList = useMemo(() => {
    if (broadcastTargetCustomer) return [broadcastTargetCustomer];
    if (selectedCustomerIds.size > 0) {
      return customers.filter((c) => selectedCustomerIds.has(c.id));
    }
    return customers;
  }, [broadcastTargetCustomer, selectedCustomerIds, customers]);

  return (
    <div className="space-y-8">
      {/* Page Title & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-caramel-500/20 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-caramel-500/20 text-caramel-400">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-wider text-cream-100">
              Customer Database & WhatsApp Broadcast
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-cream-300/70 mt-1 max-w-2xl">
            Live registered customer directory, phone OTP login records, lifetime order history, and 1-click WhatsApp broadcast tools for offers, wishes, and sweet greetings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleClearTestCustomers}
            disabled={loading}
            className="px-3.5 py-2.5 rounded-xl bg-strawberry-500/15 hover:bg-strawberry-500/25 border border-strawberry-500/30 text-strawberry-300 text-xs font-semibold flex items-center gap-2 transition-colors"
            title="Clean test customer profiles and test orders"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clean Test Customers</span>
          </button>

          <button
            onClick={() => fetchCustomers()}
            disabled={loading}
            className="px-3.5 py-2.5 rounded-xl bg-cocoa-900 border border-caramel-500/30 text-cream-200 hover:text-white text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-caramel-400" : ""}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/admin/broadcast"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-caramel-500 to-caramel-600 hover:from-caramel-400 hover:to-caramel-500 text-cocoa-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-caramel-500/25 transition-all active:scale-95"
          >
            <Megaphone className="w-4 h-4" />
            <span>Festival Broadcast Hub</span>
          </Link>

          <button
            onClick={handleOpenBulkBroadcast}
            className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#25D366]/20 transition-all active:scale-95"
          >
            <WhatsAppIcon className="w-4 h-4 text-black" />
            <span>WhatsApp Broadcast Studio</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Registered */}
        <div className="p-5 rounded-2xl bg-cocoa-900/80 border border-caramel-500/20 shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-cream-300/60 font-bold">
              Total Customers
            </span>
            <p className="text-2xl sm:text-3xl font-serif font-black text-cream-100">
              {stats.totalCustomers}
            </p>
            <span className="text-[10px] text-caramel-400 font-medium block">
              Verified OTP & Logins
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-caramel-500/15 flex items-center justify-center text-caramel-400">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Active Cravers */}
        <div className="p-5 rounded-2xl bg-cocoa-900/80 border border-caramel-500/20 shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-cream-300/60 font-bold">
              Active Cravers
            </span>
            <p className="text-2xl sm:text-3xl font-serif font-black text-caramel-400">
              {stats.activeCustomers}
            </p>
            <span className="text-[10px] text-cream-300/60 font-medium block">
              Placed 1+ Desserts
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-caramel-500/15 flex items-center justify-center text-caramel-400">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Total Customer Revenue */}
        <div className="p-5 rounded-2xl bg-cocoa-900/80 border border-caramel-500/20 shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-cream-300/60 font-bold">
              Customer Lifetime LTV
            </span>
            <p className="text-2xl sm:text-3xl font-serif font-black text-cream-100 font-mono">
              ₹{stats.totalRevenue.toLocaleString("en-IN")}
            </p>
            <span className="text-[10px] text-cream-300/60 font-medium block">
              Avg ₹{stats.avgLtv} per patron
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-caramel-500/15 flex items-center justify-center text-caramel-400">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: New This Week */}
        <div className="p-5 rounded-2xl bg-cocoa-900/80 border border-caramel-500/20 shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-cream-300/60 font-bold">
              New This Week
            </span>
            <p className="text-2xl sm:text-3xl font-serif font-black text-strawberry-400">
              +{stats.newThisWeek}
            </p>
            <span className="text-[10px] text-cream-300/60 font-medium block">
              Fresh Cravings Audience
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-strawberry-500/15 flex items-center justify-center text-strawberry-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search Bar & Segment Pills */}
      <div className="space-y-4 bg-cocoa-900/80 border border-caramel-500/20 rounded-3xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Live Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-300/40" />
            <input
              type="text"
              placeholder="Search by name, phone number, address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cocoa-950 border border-caramel-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-cream-100 placeholder:text-cream-300/40 focus:outline-none focus:border-caramel-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-cream-300/40 hover:text-cream-100"
              >
                ✕
              </button>
            )}
          </div>

          {/* Segment Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "ALL", label: "All Customers" },
              { id: "VIP", label: "👑 VIP Cravers" },
              { id: "ACTIVE", label: "🍫 Active Orders" },
              { id: "NEW", label: "🌟 New Patrons" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedSegment(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all ${
                  selectedSegment === tab.id
                    ? "bg-caramel-500 text-cocoa-950 shadow-md font-bold"
                    : "bg-cocoa-950/70 text-cream-300/70 hover:text-white border border-caramel-500/20"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Multi-Select Floating Actions */}
        {selectedCustomerIds.size > 0 && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-caramel-500/10 border border-caramel-500/30 text-xs">
            <div className="flex items-center gap-2 text-caramel-300 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-caramel-400" />
              <span>{selectedCustomerIds.size} customers selected for campaign</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDeleteSelectedCustomers}
                className="px-3 py-1.5 rounded-lg bg-strawberry-500/20 text-strawberry-300 border border-strawberry-500/40 font-bold flex items-center gap-1.5 hover:bg-strawberry-500/30 transition-all"
                title="Delete selected customers and their orders"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected ({selectedCustomerIds.size})</span>
              </button>
              <button
                onClick={handleOpenBulkBroadcast}
                className="px-3 py-1.5 rounded-lg bg-[#25D366] text-black font-bold flex items-center gap-1.5 hover:bg-[#20ba59] transition-all"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span>Broadcast to ({selectedCustomerIds.size})</span>
              </button>
              <button
                onClick={() => setSelectedCustomerIds(new Set())}
                className="px-2.5 py-1.5 rounded-lg bg-cocoa-900 text-cream-300 hover:text-white border border-caramel-500/20"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Customer Database Table */}
      <div className="bg-cocoa-900/80 border border-caramel-500/20 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-caramel-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={customers.length > 0 && selectedCustomerIds.size === customers.length}
              onChange={handleSelectAll}
              className="w-4 h-4 rounded accent-caramel-500 bg-cocoa-950 border-caramel-500/40 cursor-pointer"
            />
            <span className="text-xs font-mono uppercase tracking-wider text-cream-300/60 font-bold">
              Select All ({customers.length} Patrons)
            </span>
          </div>

          <span className="text-xs text-cream-300/50">
            Showing {customers.length} customers
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-caramel-400 animate-spin mx-auto" />
            <p className="text-xs text-cream-300/70">Loading customer database...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Users className="w-10 h-10 text-cream-300/30 mx-auto" />
            <h3 className="text-sm font-semibold text-cream-200">No Customers Found</h3>
            <p className="text-xs text-cream-300/50">
              Try adjusting your search query or segment filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cocoa-950/70 text-cream-300/60 font-mono uppercase tracking-wider border-b border-caramel-500/20">
                <tr>
                  <th className="py-3.5 px-4 w-10"></th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Phone / WhatsApp</th>
                  <th className="py-3.5 px-4">Orders & LTV</th>
                  <th className="py-3.5 px-4">Login & Activity</th>
                  <th className="py-3.5 px-4">Recent Delivery Area</th>
                  <th className="py-3.5 px-4 text-right">Quick Engagement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {customers.map((c) => {
                  const isSelected = selectedCustomerIds.has(c.id);
                  const isSent = sentCustomerIds.has(c.id);

                  // Formatting timestamps
                  const loginDate = new Date(c.lastLoginAt);
                  const timeFormatted = loginDate.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const dateFormatted = loginDate.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });

                  return (
                    <tr
                      key={c.id}
                      className={`hover:bg-white/[0.03] transition-colors ${
                        isSelected ? "bg-caramel-500/5" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(c.id)}
                          className="w-4 h-4 rounded accent-caramel-500 bg-cocoa-950 border-caramel-500/40 cursor-pointer"
                        />
                      </td>

                      {/* Customer Name & Segment Badge */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-caramel-600 to-caramel-400 text-cocoa-950 font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-cream-100 text-sm">{c.name}</p>
                              {c.segment === "VIP" && (
                                <span className="px-2 py-0.5 rounded-full bg-caramel-500/20 text-caramel-400 border border-caramel-500/40 text-[9px] font-mono font-bold">
                                  👑 VIP
                                </span>
                              )}
                              {c.segment === "ACTIVE" && (
                                <span className="px-2 py-0.5 rounded-full bg-cocoa-950 text-cream-200 border border-caramel-500/20 text-[9px] font-mono font-bold">
                                  🍫 CRAVER
                                </span>
                              )}
                              {c.segment === "NEW" && (
                                <span className="px-2 py-0.5 rounded-full bg-white/10 text-cream-300 text-[9px] font-mono font-bold">
                                  🌟 NEW
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-cream-300/50 block font-mono">
                              ID: {c.id.slice(-8)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Phone Number */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 font-mono">
                          <p className="text-cream-100 font-semibold">{c.phone}</p>
                          <a
                            href={`tel:${c.phone}`}
                            className="text-[10px] text-caramel-400 hover:underline inline-flex items-center gap-1"
                          >
                            <Phone className="w-2.5 h-2.5" /> Call Customer
                          </a>
                        </div>
                      </td>

                      {/* Orders & Total Spent */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-black text-cream-100 text-sm">
                              ₹{c.totalSpent.toLocaleString("en-IN")}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-cream-200">
                              {c.totalOrders} {c.totalOrders === 1 ? "order" : "orders"}
                            </span>
                          </div>
                          {c.latestOrderNumber && (
                            <span className="text-[10px] text-cream-300/50 block">
                              Last: #{c.latestOrderNumber} ({c.latestOrderStatus || "COMPLETED"})
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Login Timestamp & Sign-in Info */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 font-mono">
                          <div className="flex items-center gap-1 text-cream-200">
                            <Clock className="w-3 h-3 text-caramel-400" />
                            <span>{timeFormatted}</span>
                          </div>
                          <span className="text-[10px] text-cream-300/50 block">
                            {dateFormatted}
                          </span>
                        </div>
                      </td>

                      {/* Recent Delivery Address */}
                      <td className="py-3.5 px-4 max-w-xs">
                        {c.latestAddress ? (
                          <div className="flex items-start gap-1 text-[11px] text-cream-300/80 line-clamp-2">
                            <MapPin className="w-3 h-3 text-caramel-400 shrink-0 mt-0.5" />
                            <span>{c.latestAddress}</span>
                          </div>
                        ) : (
                          <span className="text-cream-300/40 italic">
                            No delivery address saved yet
                          </span>
                        )}
                      </td>

                      {/* Quick WhatsApp & Delete Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenIndividualWhatsApp(c)}
                            className="px-3 py-1.5 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-black border border-[#25D366]/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                            title="Send WhatsApp Offer, Wishes or Greetings"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </button>
                          <button
                            onClick={() => handleDeleteCustomer(c.id, c.name)}
                            disabled={loading}
                            className="p-1.5 rounded-xl bg-cocoa-950 border border-strawberry-500/30 text-strawberry-400 hover:bg-strawberry-500/20 hover:text-strawberry-300 transition-colors"
                            title={`Delete customer ${c.name} and test records`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* WHATSAPP BROADCAST STUDIO MODAL                                           */}
      {/* ========================================================================= */}
      {isBroadcastOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-cocoa-950 border border-caramel-500/30 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-caramel-500/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
                  <WhatsAppIcon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-black text-cream-100">
                    WhatsApp Broadcast Studio
                  </h2>
                  <p className="text-xs text-cream-300/70">
                    {broadcastTargetCustomer
                      ? `Engage with ${broadcastTargetCustomer.name} (${broadcastTargetCustomer.phone})`
                      : `Broadcasting to ${broadcastList.length} Selected Customers`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBroadcastOpen(false)}
                className="p-2 rounded-xl text-cream-300/50 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Campaign Template Chooser */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-cream-300/60 font-bold block">
                Choose Campaign Category / Template
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {BROADCAST_TEMPLATES.map((tmpl) => {
                  const Icon = tmpl.icon;
                  const isSelected = selectedTemplateId === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => {
                        setSelectedTemplateId(tmpl.id);
                        setCustomMessage(tmpl.text);
                      }}
                      className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                        isSelected
                          ? "bg-caramel-500/15 border-caramel-500 text-cream-100 shadow-md"
                          : "bg-cocoa-900/60 border-caramel-500/20 text-cream-300/70 hover:border-caramel-500/40"
                      }`}
                    >
                      <span className={`p-2 rounded-xl ${isSelected ? "bg-caramel-500 text-cocoa-950 font-bold" : "bg-white/5 text-caramel-400"}`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-caramel-400 font-bold block">
                          {tmpl.badge}
                        </span>
                        <p className="text-xs font-bold text-cream-100">{tmpl.name}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Editable Broadcast Message */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-cream-300/60 font-bold">
                  Broadcast Message Content
                </label>
                <span className="text-[11px] text-cream-300/50">
                  Tag: <code className="text-caramel-400">{"{{name}}"}</code> will auto-replace with patron&apos;s name
                </span>
              </div>
              <textarea
                rows={6}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full bg-cocoa-900 border border-caramel-500/30 rounded-2xl p-4 text-xs text-cream-100 placeholder:text-cream-300/40 focus:outline-none focus:border-caramel-500 font-sans leading-relaxed shadow-inner"
              />
            </div>

            {/* Live WhatsApp Chat Bubble Preview */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-cream-300/50 font-bold block">
                Live WhatsApp Customer Preview
              </span>
              <div className="p-4 rounded-2xl bg-[#0b141a] border border-[#202c33] shadow-md flex justify-end">
                <div className="max-w-md bg-[#005c4b] text-cream-100 rounded-2xl rounded-tr-none p-3.5 space-y-2 text-xs leading-relaxed shadow-md">
                  <p className="whitespace-pre-line">
                    {customMessage.replace(
                      /{{name}}/g,
                      broadcastTargetCustomer
                        ? broadcastTargetCustomer.name
                        : broadcastList[0]?.name || "Patron"
                    )}
                  </p>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-cream-300/50">
                    <span>
                      {new Date().toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="text-[#53bdeb]">✓✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recipient Dispatch Queue */}
            <div className="space-y-3 border-t border-caramel-500/20 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-cream-100">
                    Broadcast Queue ({broadcastList.length} Recipients)
                  </span>
                  {sentCustomerIds.size > 0 && (
                    <span className="text-[11px] text-[#25D366] font-semibold">
                      ({sentCustomerIds.size} Sent)
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleCopyPhoneNumbers}
                  className="text-xs text-caramel-400 hover:text-caramel-300 flex items-center gap-1 underline underline-offset-4"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedNumbers ? "Copied All Numbers!" : "Copy All Phone Numbers"}</span>
                </button>
              </div>

              {/* Customer Row Buttons */}
              <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                {broadcastList.map((customer) => {
                  const isSent = sentCustomerIds.has(customer.id);
                  const url = getWhatsAppUrl(customer, customMessage);

                  return (
                    <div
                      key={customer.id}
                      className="p-3 rounded-xl bg-cocoa-900 border border-caramel-500/20 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-full bg-caramel-500 text-cocoa-950 font-black text-xs flex items-center justify-center">
                          {customer.name.charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <p className="font-bold text-cream-100">{customer.name}</p>
                          <span className="text-[10px] text-cream-300/60 font-mono">
                            {customer.phone}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isSent && (
                          <span className="text-[10px] text-[#25D366] font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Sent
                          </span>
                        )}
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            const next = new Set(sentCustomerIds);
                            next.add(customer.id);
                            setSentCustomerIds(next);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                            isSent
                              ? "bg-white/10 text-cream-300 hover:bg-white/20"
                              : "bg-[#25D366] hover:bg-[#20ba59] text-black shadow-md shadow-[#25D366]/20"
                          }`}
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5" />
                          <span>{isSent ? "Resend" : `Send to ${customer.name.split(" ")[0]}`}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between border-t border-caramel-500/20 pt-4">
              <span className="text-xs text-cream-300/50">
                Messages open securely in official WhatsApp Web or App
              </span>
              <button
                type="button"
                onClick={() => setIsBroadcastOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-cocoa-900 border border-caramel-500/30 text-cream-200 hover:text-white text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
