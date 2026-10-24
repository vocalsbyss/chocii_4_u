"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  RefreshCw,
  Sparkles,
  Phone,
  User,
  KeyRound,
  Mail,
} from "lucide-react";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown countdown effect
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Handle Step 1: Send OTP to Email
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (!name.trim() || name.trim().length < 2) {
      setError("Please enter your full name (minimum 2 characters).");
      return;
    }

    const cleanedPhone = phone.replace(/\D/g, "");
    if (cleanedPhone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError("Please enter a valid email address (e.g. name@gmail.com).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: cleanedPhone,
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send verification code.");
      }

      setCooldown(data.cooldownSeconds || 60);
      setStep(2);
      setOtpDigits(["", "", "", "", "", ""]);

      // Auto-focus first OTP input after switching
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    } catch (err: any) {
      setError(err.message || "Failed to send verification code.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP digit typing with support for typing, paste, and auto-fill
  const handleDigitChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "");

    // If multi-digit string (e.g. from paste or autofill)
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

      // If full 6 digits are provided, trigger verification
      if (newDigits.every((d) => d.length === 1)) {
        triggerVerification(newDigits.join(""));
      }
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = cleaned.slice(-1);
    setOtpDigits(newDigits);

    // Auto-advance to next box
    if (cleaned && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all 6 digits entered
    if (cleaned && index === 5) {
      const fullCode = newDigits.join("");
      if (fullCode.length === 6) {
        triggerVerification(fullCode);
      }
    }
  };

  // Handle backspace navigation between boxes
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle clipboard paste
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

  // Internal verification function
  const triggerVerification = async (codeToVerify: string) => {
    if (codeToVerify.length !== 6) return;
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim().toLowerCase(),
          code: codeToVerify,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Verification failed. Please try again.");
      }

      // Success: redirect to intended destination
      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 2 Form Submit
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpDigits.join("");
    if (fullCode.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }
    await triggerVerification(fullCode);
  };

  return (
    <div className="min-h-screen bg-white text-cocoa-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Soft Studio Ambient Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[90vw] max-w-[600px] h-[90vw] max-h-[600px] rounded-full bg-caramel-500/5 blur-3xl pointer-events-none" />

      {/* Back button */}
      <div className="max-w-md w-full mx-auto mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cocoa-900/70 hover:text-caramel-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to chocii 4 u Home
        </Link>
      </div>

      <div className="max-w-md w-full mx-auto bg-white border-2 border-stone-200 rounded-3xl p-8 sm:p-10 shadow-xl relative">
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-full bg-caramel-500/15 border border-caramel-500/30 inline-flex items-center justify-center text-caramel-700 font-black text-xs shadow-sm mb-1 mx-auto">
            C4U
          </div>
          <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-caramel-700 font-bold">
            ( need amazing desserts )
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-cocoa-950">
            Welcome to chocii 4 u
          </h1>
          <p className="text-xs text-caramel-700 font-serif italic">
            “A Little Treat, Just for You.”
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-strawberry-500/10 border border-strawberry-500/30 text-strawberry-700 text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-strawberry-500 shrink-0" />
            {error}
          </div>
        )}

        {/* STEP 1: Full Name, Mobile Number, and Email Form */}
        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-cocoa-950 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-caramel-600" />
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm text-cocoa-950 placeholder:text-cocoa-950/40 focus:outline-none focus:border-caramel-500 focus:ring-2 focus:ring-caramel-500/15 shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-cocoa-950 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-caramel-600" />
                Mobile Number
              </label>
              <div className="flex rounded-xl overflow-hidden border border-stone-300 focus-within:border-caramel-500 focus-within:ring-2 focus-within:ring-caramel-500/15 bg-white shadow-sm">
                <span className="bg-stone-50 px-3.5 py-3 text-xs font-bold text-cocoa-950 border-r border-stone-200 flex items-center">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  placeholder="Enter 10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={10}
                  className="w-full bg-transparent px-4 py-3 text-sm text-cocoa-950 placeholder:text-cocoa-950/40 focus:outline-none font-mono"
                />
              </div>
              <p className="text-[11px] text-cocoa-900/60 pt-0.5">
                For order delivery contact and WhatsApp updates.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-cocoa-950 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-caramel-600" />
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="Enter email (e.g. name@gmail.com)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm text-cocoa-950 placeholder:text-cocoa-950/40 focus:outline-none focus:border-caramel-500 focus:ring-2 focus:ring-caramel-500/15 shadow-sm"
              />
              <p className="text-[11px] text-cocoa-900/60 pt-0.5">
                Your 6-digit verification code will be sent to this email address.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-cocoa-950 hover:bg-caramel-500 text-white hover:text-cocoa-950 font-bold uppercase tracking-wider text-xs shadow-xl shadow-cocoa-950/15 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Sending Verification Code...
                </>
              ) : (
                <>
                  Send Verification Code
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* STEP 2: 6-Digit Email OTP Verification Screen */
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-1 text-center">
              <div className="inline-flex items-center gap-1 text-[11px] font-mono text-caramel-700 font-bold uppercase tracking-widest bg-caramel-500/10 px-3 py-1 rounded-full border border-caramel-500/20">
                <Mail className="w-3.5 h-3.5 text-caramel-600" />
                Email Code Verification
              </div>
              <h2 className="text-xl font-bold text-cocoa-950 pt-2">Check Your Email</h2>
              <p className="text-xs text-cocoa-900/70">
                We've sent a 6-digit verification code to{" "}
                <strong className="text-cocoa-950 font-mono break-all">{email}</strong>
              </p>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-caramel-700 underline font-semibold hover:text-caramel-800 mt-1 inline-block"
              >
                ← Change email or mobile number
              </button>
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
                  Please check your email messages at <strong className="break-all">{email}</strong>. Check your Spam or Promotions folder if it doesn't appear in Primary.
                </p>
                <p className="text-[10px] text-caramel-800 font-mono pt-0.5">
                  Mobile registered for orders: +91 {phone}
                </p>
              </div>
            </div>

            {/* 6-Digit Inputs (Mobile responsive: fits 320px-430px comfortably) */}
            <div className="flex justify-between gap-1.5 sm:gap-2 on-paste" onPaste={handlePaste}>
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
                  className="w-10 sm:w-12 h-12 sm:h-14 text-center text-xl sm:text-2xl font-bold font-mono bg-white border-2 border-stone-300 rounded-xl text-cocoa-950 focus:outline-none focus:border-caramel-500 focus:ring-2 focus:ring-caramel-500/20 transition-all shadow-sm"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-cocoa-950 hover:bg-caramel-500 text-white hover:text-cocoa-950 font-bold uppercase tracking-wider text-xs shadow-xl shadow-cocoa-950/15 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying Code...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Verify & Enter chocii 4 u
                </>
              )}
            </button>

            {/* Resend Cooldown */}
            <div className="text-center text-xs text-cocoa-900/60">
              {cooldown > 0 ? (
                <span>
                  Resend email code in{" "}
                  <strong className="text-cocoa-950 font-mono">{cooldown}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSendOtp()}
                  className="text-caramel-700 hover:underline font-semibold"
                >
                  Resend verification code to email
                </button>
              )}
            </div>
          </form>
        )}

        {/* Security Notice */}
        <div className="mt-8 pt-6 border-t border-stone-200 flex items-center justify-center gap-2 text-[11px] text-cocoa-900/60">
          <ShieldCheck className="w-3.5 h-3.5 text-caramel-600" />
          <span>Encrypted customer authentication • Session cookie secured</span>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center text-cocoa-950">
          <RefreshCw className="w-6 h-6 animate-spin text-caramel-600" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
