"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Tag,
  Plus,
  RefreshCw,
  Trash2,
  Check,
  Percent,
  IndianRupee,
  Calendar,
  AlertCircle,
  Copy,
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discountType: "PERCENTAGE" | "FLAT";
  discountValue: number;
  minOrderValue: number | null;
  maxDiscount: number | null;
  validFrom: string | null;
  validTill: string | null;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FLAT">("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState<number>(15);
  const [minOrderValue, setMinOrderValue] = useState<string>("");
  const [maxDiscount, setMaxDiscount] = useState<string>("");
  const [validTill, setValidTill] = useState<string>("");
  const [usageLimit, setUsageLimit] = useState<string>("");
  const [isActive, setIsActive] = useState(true);

  // Festival context for inspiration
  const [todayFestival, setTodayFestival] = useState<any>(null);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (data.coupons) {
        setCoupons(data.coupons);
      }
    } catch (err) {
      console.error("Failed to load coupons", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
    // Also fetch today's festival to suggest relevant codes
    fetch("/api/festivals/today")
      .then((res) => res.json())
      .then((data) => {
        if (data.festival) {
          setTodayFestival(data.festival);
        }
      })
      .catch(() => {});
  }, []);

  const handleCopy = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !coupon.isActive }),
      });
      if (res.ok) {
        setCoupons((prev) =>
          prev.map((c) => (c.id === coupon.id ? { ...c, isActive: !c.isActive } : c))
        );
      }
    } catch (err) {
      console.error("Failed to toggle coupon status", err);
    }
  };

  const handleDeleteCoupon = async (id: string, codeName: string) => {
    if (!window.confirm(`Are you sure you want to delete coupon code "${codeName}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
        setMessage({ type: "success", text: `Coupon "${codeName}" deleted successfully.` });
      } else {
        setMessage({ type: "error", text: "Failed to delete coupon." });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to delete coupon." });
    }
  };

  const applyPreset = (preset: {
    code: string;
    description: string;
    discountType: "PERCENTAGE" | "FLAT";
    discountValue: number;
    minOrderValue?: string;
    maxDiscount?: string;
  }) => {
    setCode(preset.code);
    setDescription(preset.description);
    setDiscountType(preset.discountType);
    setDiscountValue(preset.discountValue);
    setMinOrderValue(preset.minOrderValue || "");
    setMaxDiscount(preset.maxDiscount || "");
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          description: description.trim() || undefined,
          discountType,
          discountValue: Number(discountValue),
          minOrderValue: minOrderValue ? Number(minOrderValue) : undefined,
          maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
          validTill: validTill ? new Date(validTill).toISOString() : undefined,
          usageLimit: usageLimit ? Number(usageLimit) : undefined,
          isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create coupon.");
      }

      setMessage({ type: "success", text: `Coupon "${data.coupon.code}" created successfully!` });
      setIsModalOpen(false);
      resetForm();
      fetchCoupons();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to create coupon." });
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
    setCode("");
    setDescription("");
    setDiscountType("PERCENTAGE");
    setDiscountValue(15);
    setMinOrderValue("");
    setMaxDiscount("");
    setValidTill("");
    setUsageLimit("");
    setIsActive(true);
  };

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalUsed = coupons.reduce((sum, c) => sum + c.usedCount, 0);
  const activeCount = coupons.filter((c) => c.isActive).length;

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-caramel-500/10 border border-caramel-500/20 text-caramel-400">
                <Tag className="w-5 h-5" />
              </span>
              <h1 className="text-2xl md:text-3xl font-serif font-black text-cream-100">
                Coupons & Discounts
              </h1>
            </div>
            <p className="text-xs text-cream-300/60 mt-1">
              Create and manage special discount codes for customer orders at checkout.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchCoupons}
              className="p-2.5 rounded-xl bg-cocoa-900 border border-white/10 text-cream-200 hover:text-caramel-400 hover:border-caramel-500/40 transition-colors"
              title="Refresh list"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-caramel-500 to-caramel-600 hover:from-caramel-400 hover:to-caramel-500 text-cocoa-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-caramel-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              Create New Coupon
            </button>
          </div>
        </div>

        {/* Today's Festival Inspiration Banner */}
        {todayFestival && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-caramel-500/15 via-cocoa-900 to-cocoa-900 border border-caramel-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{todayFestival.emoji}</span>
              <div>
                <p className="text-xs font-bold text-caramel-300 uppercase tracking-wider">
                  {todayFestival.isToday ? "Today is" : "Upcoming Celebration"}: {todayFestival.name}
                </p>
                <p className="text-[11px] text-cream-200/80">
                  {todayFestival.greeting} Offer a celebratory discount code to delight your customers!
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                const festivalSlug = todayFestival.name.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
                applyPreset({
                  code: `${festivalSlug.slice(0, 8)}20`,
                  description: `${todayFestival.name} celebration special - 20% OFF!`,
                  discountType: "PERCENTAGE",
                  discountValue: 20,
                  minOrderValue: "299",
                  maxDiscount: "150",
                });
                setIsModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-caramel-500/20 hover:bg-caramel-500/30 border border-caramel-500/40 text-caramel-300 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Create {todayFestival.name} Coupon
            </button>
          </div>
        )}

        {/* Status Alerts */}
        {message && (
          <div
            className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
              message.type === "success"
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                : "bg-strawberry-500/15 border-strawberry-500/40 text-strawberry-300"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-cocoa-900/60 border border-caramel-500/20 rounded-2xl p-5 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-caramel-400">
              Total Coupons
            </span>
            <p className="text-2xl font-serif font-black text-cream-100">{coupons.length}</p>
            <p className="text-[11px] text-cream-300/50">Configured in database</p>
          </div>

          <div className="bg-cocoa-900/60 border border-caramel-500/20 rounded-2xl p-5 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Active Coupons
            </span>
            <p className="text-2xl font-serif font-black text-emerald-400">{activeCount}</p>
            <p className="text-[11px] text-cream-300/50">Currently usable by customers</p>
          </div>

          <div className="bg-cocoa-900/60 border border-caramel-500/20 rounded-2xl p-5 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-caramel-400">
              Total Times Redeemed
            </span>
            <p className="text-2xl font-serif font-black text-cream-100">{totalUsed}</p>
            <p className="text-[11px] text-cream-300/50">Successful order checkouts</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-cream-300/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search coupon code or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-cocoa-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-cream-100 placeholder:text-cream-300/30 focus:outline-none focus:border-caramel-500"
            />
          </div>
        </div>

        {/* Coupons List */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-caramel-400 animate-spin mx-auto" />
            <p className="text-xs text-cream-300/60 font-medium">Loading coupons...</p>
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="py-16 text-center bg-cocoa-900/40 border border-white/5 rounded-3xl p-8 space-y-3">
            <Tag className="w-10 h-10 text-caramel-400/40 mx-auto" />
            <h3 className="text-sm font-bold text-cream-100">No coupons found</h3>
            <p className="text-xs text-cream-300/50 max-w-sm mx-auto">
              Create your first promotional discount code to reward customers during checkout.
            </p>
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-caramel-500/20 hover:bg-caramel-500/30 border border-caramel-500/30 text-caramel-300 font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Create First Coupon
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCoupons.map((coupon) => {
              const isExpired =
                coupon.validTill && new Date(coupon.validTill).getTime() < Date.now();
              const isLimitReached =
                coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit;

              return (
                <div
                  key={coupon.id}
                  className={`bg-cocoa-900/80 border rounded-3xl p-5 space-y-4 transition-all relative overflow-hidden flex flex-col justify-between ${
                    coupon.isActive && !isExpired && !isLimitReached
                      ? "border-caramel-500/30 hover:border-caramel-500/50 shadow-lg shadow-black/20"
                      : "border-white/5 opacity-75"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header: Code & Active Toggle */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1.5 rounded-xl bg-caramel-500/15 border border-caramel-500/30 font-mono font-bold text-caramel-300 text-sm tracking-wider flex items-center gap-1.5">
                          {coupon.code}
                          <button
                            onClick={() => handleCopy(coupon.code)}
                            className="text-cream-300/60 hover:text-cream-100 transition-colors ml-1"
                            title="Copy code"
                          >
                            {copiedCode === coupon.code ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Status Badge */}
                        {isExpired ? (
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-strawberry-500/10 text-strawberry-400 border border-strawberry-500/20">
                            Expired
                          </span>
                        ) : isLimitReached ? (
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-strawberry-500/10 text-strawberry-400 border border-strawberry-500/20">
                            Limit Reached
                          </span>
                        ) : coupon.isActive ? (
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Active
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/5 text-cream-300/40 border border-white/10">
                            Paused
                          </span>
                        )}

                        {/* Toggle Active Button */}
                        <button
                          onClick={() => handleToggleActive(coupon)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            coupon.isActive
                              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25"
                              : "bg-white/5 border-white/10 text-cream-300/50 hover:bg-white/10"
                          }`}
                          title={coupon.isActive ? "Pause Coupon" : "Activate Coupon"}
                        >
                          {coupon.isActive ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                          className="p-1.5 rounded-lg border border-white/5 text-cream-300/40 hover:text-strawberry-400 hover:bg-strawberry-500/10 hover:border-strawberry-500/20 transition-colors"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Discount Headline */}
                    <div className="flex items-center gap-1.5 text-base font-bold text-cream-100">
                      {coupon.discountType === "PERCENTAGE" ? (
                        <>
                          <Percent className="w-4 h-4 text-caramel-400" />
                          <span>{coupon.discountValue}% OFF</span>
                          {coupon.maxDiscount && (
                            <span className="text-xs text-cream-300/60 font-normal">
                              (up to ₹{coupon.maxDiscount})
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <IndianRupee className="w-4 h-4 text-caramel-400" />
                          <span>Flat ₹{coupon.discountValue} OFF</span>
                        </>
                      )}
                    </div>

                    {/* Description */}
                    {coupon.description && (
                      <p className="text-xs text-cream-300/70 leading-relaxed">
                        {coupon.description}
                      </p>
                    )}

                    {/* Conditions */}
                    <div className="space-y-1 text-[11px] text-cream-300/50 border-t border-white/5 pt-2.5">
                      {coupon.minOrderValue && (
                        <div className="flex items-center justify-between">
                          <span>Min. Order Value:</span>
                          <span className="font-semibold text-cream-200">
                            ₹{coupon.minOrderValue}
                          </span>
                        </div>
                      )}
                      {coupon.validTill && (
                        <div className="flex items-center justify-between">
                          <span>Valid Till:</span>
                          <span className="font-semibold text-cream-200">
                            {new Date(coupon.validTill).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Usage Counter Bar */}
                  <div className="border-t border-white/5 pt-3 mt-3">
                    <div className="flex justify-between text-[11px] text-cream-300/60 mb-1">
                      <span>Redemptions</span>
                      <span className="font-semibold text-cream-100">
                        {coupon.usedCount}{" "}
                        {coupon.usageLimit ? `/ ${coupon.usageLimit}` : "uses"}
                      </span>
                    </div>
                    {coupon.usageLimit && (
                      <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-caramel-400 h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, (coupon.usedCount / coupon.usageLimit) * 100)}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Create Coupon Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-cocoa-900 border border-caramel-500/30 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-caramel-500/10 text-caramel-400">
                    <Tag className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="text-lg font-serif font-bold text-cream-100">
                      Create Discount Coupon
                    </h2>
                    <p className="text-[11px] text-cream-300/60">
                      Offer a custom discount code for website checkouts.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-cream-300/60 hover:text-cream-100 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Quick Presets */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-caramel-400">
                  Quick Presets
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      applyPreset({
                        code: "FESTIVE50",
                        description: "Festive celebration flat ₹50 discount",
                        discountType: "FLAT",
                        discountValue: 50,
                        minOrderValue: "349",
                      })
                    }
                    className="p-2 rounded-xl bg-cocoa-950/80 border border-white/5 hover:border-caramel-500/40 text-left transition-colors"
                  >
                    <p className="text-xs font-bold text-cream-100 font-mono">FESTIVE50</p>
                    <p className="text-[10px] text-cream-300/60">Flat ₹50 OFF (Min ₹349)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      applyPreset({
                        code: "SWEET20",
                        description: "20% OFF on all gourmet dessert boxes",
                        discountType: "PERCENTAGE",
                        discountValue: 20,
                        minOrderValue: "399",
                        maxDiscount: "120",
                      })
                    }
                    className="p-2 rounded-xl bg-cocoa-950/80 border border-white/5 hover:border-caramel-500/40 text-left transition-colors"
                  >
                    <p className="text-xs font-bold text-cream-100 font-mono">SWEET20</p>
                    <p className="text-[10px] text-cream-300/60">20% OFF (Up to ₹120)</p>
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreateCoupon} className="space-y-4">
                {/* Coupon Code */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-caramel-400">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DIWALI20, CHOCO100"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-mono uppercase tracking-wider text-cream-100 placeholder:text-cream-300/30 focus:outline-none focus:border-caramel-500"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-caramel-400">
                    Description / Display Note
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Special festive celebration offer on orders above ₹299"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-cream-100 placeholder:text-cream-300/30 focus:outline-none focus:border-caramel-500"
                  />
                </div>

                {/* Discount Type & Value */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-caramel-400">
                      Discount Type
                    </label>
                    <select
                      value={discountType}
                      onChange={(e) =>
                        setDiscountType(e.target.value as "PERCENTAGE" | "FLAT")
                      }
                      className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-cream-100 focus:outline-none focus:border-caramel-500"
                    >
                      <option value="PERCENTAGE">Percentage (%) OFF</option>
                      <option value="FLAT">Flat (₹) OFF</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-caramel-400">
                      Discount Value *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        min={1}
                        max={discountType === "PERCENTAGE" ? 100 : 5000}
                        value={discountValue}
                        onChange={(e) => setDiscountValue(Number(e.target.value))}
                        className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-cream-100 focus:outline-none focus:border-caramel-500 pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-caramel-400">
                        {discountType === "PERCENTAGE" ? "%" : "₹"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Min Order Value & Max Discount */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-caramel-400">
                      Min. Order Value (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 299 (Optional)"
                      value={minOrderValue}
                      onChange={(e) => setMinOrderValue(e.target.value)}
                      className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-cream-100 placeholder:text-cream-300/30 focus:outline-none focus:border-caramel-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-caramel-400">
                      Max Discount Cap (₹)
                    </label>
                    <input
                      type="number"
                      placeholder={
                        discountType === "PERCENTAGE" ? "e.g. 150" : "N/A for flat discount"
                      }
                      disabled={discountType === "FLAT"}
                      value={maxDiscount}
                      onChange={(e) => setMaxDiscount(e.target.value)}
                      className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-cream-100 placeholder:text-cream-300/30 focus:outline-none focus:border-caramel-500 disabled:opacity-30"
                    />
                  </div>
                </div>

                {/* Expiry Date & Usage Limit */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-caramel-400">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={validTill}
                      onChange={(e) => setValidTill(e.target.value)}
                      className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-cream-100 focus:outline-none focus:border-caramel-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-caramel-400">
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      placeholder="Unlimited if empty"
                      value={usageLimit}
                      onChange={(e) => setUsageLimit(e.target.value)}
                      className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-cream-100 placeholder:text-cream-300/30 focus:outline-none focus:border-caramel-500"
                    />
                  </div>
                </div>

                {/* Active Switch */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-cocoa-950/60 border border-white/5">
                  <span className="text-xs font-bold text-cream-100">
                    Enable Coupon Immediately
                  </span>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-caramel-500 focus:ring-caramel-500"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-cream-300/70 hover:text-cream-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-caramel-500 to-caramel-600 hover:from-caramel-400 hover:to-caramel-500 text-cocoa-950 font-bold text-xs shadow-lg shadow-caramel-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Saving Coupon...
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Create Coupon
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
