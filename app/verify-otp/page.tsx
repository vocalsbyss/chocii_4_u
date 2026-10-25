"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  Sparkles,
  KeyRound,
  CheckCircle,
  Mail,
} from "lucide-react";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneParam = searchParams.get("phone") || "";
  const nameParam = searchParams.get("name") || "";
  const emailParam = searchParams.get("email") || "";
  const redirectPath = searchParams.get("redirect") || "/";

  const [phone, setPhone] = useState(phoneParam);
  const [name, setName] = useState(nameParam);
  const [email, setEmail] = useState(emailParam);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(60);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (phoneParam) setPhone(phoneParam);
    if (nameParam) setName(nameParam);
    if (emailParam) setEmail(emailParam);

    // Auto-focus first digit
    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 150);
  }, [phoneParam, nameParam, emailParam]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const triggerVerification = async (codeToVerify: string) => {
    if (codeToVerify.length !== 6) return;
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name ? name.trim() : undefined,
          phone: phone ? phone.trim() : undefined,
          email: email ? email.trim().toLowerCase() : undefined,
          code: codeToVerify,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Verification failed. Please try again.");
      }

      // Sync customer user state
      if (data.user) {
        try {
          localStorage.setItem("cravings_customer_user", JSON.stringify(data.user));
        } catch {}
        window.dispatchEvent(new CustomEvent("cravings_auth_changed", { detail: data.user }));
      }

      window.location.href = redirectPath;
    } catch (err: any) {
      setError(err.message || "Invalid verification code.");
      setLoading(false);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "");

    // Multi-digit paste or autofill
    if (cleaned.length > 1) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        if (i >= index && cleaned[i - index]) {
          newDigits[i] = cleaned[i - index];
        }
      }
      setOtpDigits(newDigits);
      const nextIdx = Math.min(index + cleaned.length, 5);
      otpInputRefs.current[nextIdx]?.focus();

      if (newDigits.every((d) => d.length === 1)) {
        triggerVerification(newDigits.join(""));
      }
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = cleaned.slice(-1);
    setOtpDigits(newDigits);

    if (cleaned && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    if (cleaned && index === 5) {
      const fullCode = newDigits.join("");
      if (fullCode.length === 6) {
        triggerVerification(fullCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasted[i] || "";
      }
      setOtpDigits(newDigits);
      const nextIndex = Math.min(pasted.length, 5);
      otpInputRefs.current[nextIndex]?.focus();

      if (pasted.length === 6) {
        triggerVerification(pasted);
      }
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpDigits.join("");
    if (fullCode.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }
    await triggerVerification(fullCode);
  };

  const handleResend = async () => {
    if (cooldown > 0 || (!phone && !email)) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "Customer",
          phone: phone || "8688367177",
          email: email || "customer@example.com",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to resend code.");
      }
      setCooldown(data.cooldownSeconds || 60);
      setOtpDigits(["", "", "", "", "", ""]);
      otpInputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-cocoa-950 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-32 bg-white">
        <div className="w-full max-w-md space-y-6">
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 text-xs font-semibold text-cocoa-900/70 hover:text-caramel-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Change Phone or Email
          </Link>

          <div className="bg-white border-2 border-stone-200 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
            <div className="space-y-2 text-center">
              <div className="w-12 h-12 rounded-full bg-caramel-500/15 text-caramel-700 flex items-center justify-center mx-auto border border-caramel-500/30">
                <Mail className="w-6 h-6" />
              </div>
              <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-caramel-700 font-bold">
                ( need amazing desserts )
              </div>
              <h1 className="text-2xl font-serif font-black text-cocoa-950">
                Check Your Email
              </h1>
              <p className="text-xs text-cocoa-900/70">
                Enter the 6-digit code sent to{" "}
                <strong className="text-cocoa-950 font-mono break-all">
                  {email || (phone ? `+91 ${phone}` : "your email")}
                </strong>
              </p>
            </div>

            {/* Email Message Delivery Notification */}
            <div className="p-4 rounded-2xl bg-caramel-500/10 border border-caramel-500/30 flex items-start gap-3 text-left">
              <div className="w-9 h-9 rounded-full bg-caramel-500/20 text-caramel-800 flex items-center justify-center shrink-0 mt-0.5 border border-caramel-500/30">
                <Mail className="w-4 h-4 text-caramel-700" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-cocoa-950">
                  Verification Code Sent to Your Inbox
                </p>
                <p className="text-[11px] text-cocoa-900/75 leading-relaxed">
                  We sent a 6-digit verification code to <strong>{email || phone}</strong>. Please check your Inbox and Spam folder.
                </p>
                {phone && (
                  <p className="text-[10px] text-caramel-800 font-mono pt-0.5">
                    Delivery contact phone: +91 {phone}
                  </p>
                )}
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-strawberry-500/10 border border-strawberry-500/30 text-strawberry-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {/* 6 Digit Input Group (Mobile responsive: fits 320px-430px) */}
              <div className="flex justify-center gap-1.5 sm:gap-3 on-paste" onPaste={handlePaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    autoComplete={idx === 0 ? "one-time-code" : undefined}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-10 sm:w-12 h-12 sm:h-14 text-center text-xl sm:text-2xl font-mono font-bold rounded-xl bg-white border-2 border-stone-300 text-cocoa-950 focus:outline-none focus:border-caramel-500 focus:ring-2 focus:ring-caramel-500/20 transition-all shadow-sm"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-cocoa-950 hover:bg-caramel-500 text-white hover:text-cocoa-950 font-bold uppercase tracking-wider text-xs shadow-xl shadow-cocoa-950/15 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirm & Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center text-xs text-cocoa-900/60 flex items-center justify-center gap-2">
                {cooldown > 0 ? (
                  <span>
                    Resend code in{" "}
                    <strong className="text-cocoa-950 font-mono">{cooldown}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={loading}
                    className="text-caramel-700 hover:text-caramel-800 font-semibold underline underline-offset-4"
                  >
                    Resend verification code to email
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="text-center text-[11px] text-cocoa-900/60 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-caramel-600" />
            <span>256-Bit Encrypted Session Authentication</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center text-cocoa-950">
          <RefreshCw className="w-6 h-6 animate-spin text-caramel-600" />
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
