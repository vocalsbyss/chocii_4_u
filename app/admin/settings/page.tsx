"use client";

import React, { useState, useEffect } from "react";
import { Check, RefreshCw, AlertCircle, Save, Store, Truck, Clock, Phone, Instagram } from "lucide-react";
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
    homepage_style: "cooldock",
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

        {/* Storefront Experience & Showcase Style */}
        <div className="bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-cream-100 flex items-center gap-2">
                <Store className="w-4 h-4 text-caramel-400" />
                Storefront Showcase Style (Homepage Experience)
              </h3>
              <p className="text-xs text-cream-300/60 max-w-xl">
                Choose the landing experience for visitors. You can preview, test, or undo anytime.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <label
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                (settings.homepage_style || "cooldock") === "cooldock"
                  ? "bg-caramel-500/15 border-caramel-400 text-cream-100 shadow-md ring-1 ring-caramel-400/30"
                  : "bg-cocoa-950/60 border-white/10 text-cream-300/70 hover:border-white/20"
              }`}
            >
              <input
                type="radio"
                name="homepage_style"
                value="cooldock"
                checked={(settings.homepage_style || "cooldock") === "cooldock"}
                onChange={() => setSettings({ ...settings, homepage_style: "cooldock" })}
                className="mt-1"
              />
              <div className="space-y-1">
                <div className="text-xs font-bold text-cream-100 flex items-center gap-1.5">
                  <span>CoolDock Interactive Dock & Scroll Transitions</span>
                  <span className="px-2 py-0.5 rounded-full bg-caramel-500/20 text-caramel-300 text-[9px] font-mono font-bold uppercase">
                    Modern
                  </span>
                </div>
                <p className="text-[11px] text-cream-300/60 leading-relaxed">
                  Frosted glass Mac dock with 4 signature creations floating & docking into place as the customer scrolls, smoothly flowing into the menu.
                </p>
              </div>
            </label>

            <label
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                settings.homepage_style === "classic"
                  ? "bg-caramel-500/15 border-caramel-400 text-cream-100 shadow-md ring-1 ring-caramel-400/30"
                  : "bg-cocoa-950/60 border-white/10 text-cream-300/70 hover:border-white/20"
              }`}
            >
              <input
                type="radio"
                name="homepage_style"
                value="classic"
                checked={settings.homepage_style === "classic"}
                onChange={() => setSettings({ ...settings, homepage_style: "classic" })}
                className="mt-1"
              />
              <div className="space-y-1">
                <div className="text-xs font-bold text-cream-100">
                  Classic Editorial White Hero
                </div>
                <p className="text-[11px] text-cream-300/60 leading-relaxed">
                  Clean editorial typography layout with high-precision grid watermark, tagline, and direct "Explore Cravings" call to action.
                </p>
              </div>
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
      </div>
    </form>
  );
}
