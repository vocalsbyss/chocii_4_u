"use client";

import React, { useState, useEffect } from "react";
import { Check, RefreshCw, AlertCircle, Save, Store, Truck, Clock, Phone, Instagram, CreditCard, QrCode, ShieldCheck } from "lucide-react";
import { StoreSettings } from "@/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>({
    brandName: "chocii 4 u",
    brandTagline: "A Little Treat, Just for You.",
    deliveryFee: 49,
    freeDeliveryThreshold: 599,
    minOrderValue: 199,
    storeIsOpen: true,
    openingHours: "12:00 PM - 01:00 AM",
    contactPhone: "+91 86883 67177",
    instagramUrl: "https://instagram.com/chocii4u.official",
    razorpayKeyId: "",
    razorpayKeySecret: "",
    storeUpiId: "8688367177@okbizaxis",
    storeUpiName: "chocii 4 u",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch((e) => console.error("Error loading settings", e))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save settings");
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-caramel-400 animate-spin mx-auto" />
        <p className="text-sm font-medium">Loading store settings...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-caramel-400 font-bold">
            Operational Rules
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-cream-100 mt-1">
            Store & Delivery Settings
          </h1>
          <p className="text-xs text-cream-300/60 mt-0.5">
            Configure delivery fees, free delivery limits, store open status, and contact info.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-2xl bg-caramel-500 hover:bg-caramel-400 text-cocoa-950 font-bold uppercase tracking-wider text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto disabled:opacity-50"
        >
          {saving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : savedSuccess ? (
            <Check className="w-4 h-4 stroke-[3] text-emerald-950" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {savedSuccess ? "Saved Successfully!" : "Save Settings"}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-strawberry-500/15 border border-strawberry-500/40 text-strawberry-300 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Settings Cards */}
      <div className="space-y-6">
        {/* Store Active Status Toggle */}
        <div className="bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  settings.storeIsOpen ? "bg-emerald-500/20 text-emerald-400" : "bg-strawberry-500/20 text-strawberry-400"
                }`}
              >
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-cream-100">
                  Store Kitchen Status: {settings.storeIsOpen ? "Open & Accepting Orders" : "Closed (Temporarily Offline)"}
                </h3>
                <p className="text-xs text-cream-300/60">
                  When closed, customer checkout displays a friendly notice and blocks submissions.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.storeIsOpen}
                onChange={(e) =>
                  setSettings({ ...settings, storeIsOpen: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-cocoa-950 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>

        {/* Delivery & Thresholds */}
        <div className="bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-caramel-400 flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Delivery Rates & Rules (Enforced on Server)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-cream-200">
                Standard Delivery Fee (₹)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={settings.deliveryFee}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    deliveryFee: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-cream-100 focus:outline-none focus:border-caramel-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-cream-200">
                Free Delivery Above (₹)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={settings.freeDeliveryThreshold}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    freeDeliveryThreshold: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-cream-100 focus:outline-none focus:border-caramel-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-cream-200">
                Minimum Order Value (₹)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={settings.minOrderValue}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    minOrderValue: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-cream-100 focus:outline-none focus:border-caramel-500"
              />
            </div>
          </div>
        </div>

        {/* Operating Hours & Contact */}
        <div className="bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-caramel-400 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Kitchen Schedule & Contact
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-cream-200">
                Daily Operating Hours
              </label>
              <input
                type="text"
                value={settings.openingHours}
                onChange={(e) =>
                  setSettings({ ...settings, openingHours: e.target.value })
                }
                placeholder="12:00 PM - 01:00 AM"
                className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-cream-100 focus:outline-none focus:border-caramel-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-cream-200">
                Customer Support Hotline Phone
              </label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) =>
                  setSettings({ ...settings, contactPhone: e.target.value })
                }
                placeholder="+91 86883 67177"
                className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-cream-100 focus:outline-none focus:border-caramel-500"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-cream-200">
                Official Instagram URL
              </label>
              <input
                type="url"
                value={settings.instagramUrl}
                onChange={(e) =>
                  setSettings({ ...settings, instagramUrl: e.target.value })
                }
                placeholder="https://instagram.com/chocii4u.official"
                className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-cream-100 focus:outline-none focus:border-caramel-500"
              />
            </div>
          </div>
        </div>

        {/* Payment Gateway & UPI Configuration */}
        <div className="bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-caramel-400 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Online Payment & UPI Configuration
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Active System
            </span>
          </div>

          <p className="text-xs text-cream-300/70">
            Configure direct UPI (Google Pay, PhonePe, Paytm QR) and Razorpay gateway credentials. When configured here, customer payments work immediately without needing server redeploys.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-cream-200 flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-caramel-400" />
                Store UPI ID (VPA)
              </label>
              <input
                type="text"
                value={settings.storeUpiId || ""}
                onChange={(e) =>
                  setSettings({ ...settings, storeUpiId: e.target.value })
                }
                placeholder="e.g. 8688367177@okbizaxis or 8688367177@ybl"
                className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-cream-100 focus:outline-none focus:border-caramel-500 font-mono"
              />
              <p className="text-[11px] text-cream-300/40">
                Used to generate dynamic instant UPI QR codes and 1-tap PhonePe/GPay links.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-cream-200">
                UPI Payee Business Name
              </label>
              <input
                type="text"
                value={settings.storeUpiName || ""}
                onChange={(e) =>
                  setSettings({ ...settings, storeUpiName: e.target.value })
                }
                placeholder="chocii 4 u"
                className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-cream-100 focus:outline-none focus:border-caramel-500"
              />
              <p className="text-[11px] text-cream-300/40">
                Displayed as receiver name inside customer UPI apps upon scan.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-cream-200">
                Razorpay Key ID (Optional)
              </label>
              <input
                type="text"
                value={settings.razorpayKeyId || ""}
                onChange={(e) =>
                  setSettings({ ...settings, razorpayKeyId: e.target.value })
                }
                placeholder="rzp_live_... or rzp_test_..."
                className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-cream-100 focus:outline-none focus:border-caramel-500 font-mono"
              />
              <p className="text-[11px] text-cream-300/40">
                Find this in your Razorpay Dashboard &rarr; Settings &rarr; API Keys.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-cream-200">
                Razorpay Key Secret (Optional)
              </label>
              <input
                type="password"
                value={settings.razorpayKeySecret || ""}
                onChange={(e) =>
                  setSettings({ ...settings, razorpayKeySecret: e.target.value })
                }
                placeholder="Enter new secret or leave blank to keep unchanged"
                className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-cream-100 focus:outline-none focus:border-caramel-500 font-mono"
              />
              <p className="text-[11px] text-cream-300/40">
                Kept secure and encrypted. Used for signature verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
