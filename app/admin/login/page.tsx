"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, Phone, ShieldCheck, ArrowRight, RefreshCw, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!phone.trim()) {
      setError("Please enter your admin mobile number or username.");
      return;
    }
    if (!password) {
      setError("Please enter your admin password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to sign into admin portal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cocoa-950 text-cream-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-caramel-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-md w-full mx-auto bg-cocoa-900/80 border border-caramel-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-full overflow-hidden bg-white/10 border border-caramel-500/30 flex items-center justify-center p-1 shadow-md mb-2">
            <Image
              src="/images/chocii-logo.png"
              alt="chocii 4 u logo"
              width={56}
              height={56}
              className="object-contain w-full h-full rounded-full"
              priority
            />
          </div>
          <h1 className="text-2xl font-serif font-black text-cream-100 lowercase">
            chocii 4 u
          </h1>
          <p className="text-xs text-caramel-400 font-bold uppercase tracking-widest">
            Kitchen & Admin Portal
          </p>
          <p className="text-xs text-cream-300/60 font-light">
            Authorized management credentials required.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-caramel-400">
              Admin Mobile Number or Username
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-300/40" />
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter mobile or username"
                className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-cream-100 placeholder:text-cream-300/30 focus:outline-none focus:border-caramel-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-caramel-400">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-300/40" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-cream-100 placeholder:text-cream-300/30 focus:outline-none focus:border-caramel-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-caramel-500 to-caramel-600 hover:from-caramel-400 hover:to-caramel-500 text-cocoa-950 font-bold uppercase tracking-wider text-xs shadow-xl shadow-caramel-500/25 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                Access Admin Dashboard
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <Link
            href="/"
            className="text-xs text-cream-300/50 hover:text-caramel-400 transition-colors"
          >
            ← Back to Customer Website
          </Link>
        </div>
      </div>
    </div>
  );
}
