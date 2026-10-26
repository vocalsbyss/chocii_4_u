"use client";

import React, { useState, useEffect } from "react";
import {
  QrCode,
  Smartphone,
  Copy,
  Check,
  RefreshCw,
  X,
  AlertCircle,
  CreditCard,
  Banknote,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  upiId: string;
  upiName: string;
  isConfigured: boolean;
  keyId?: string;
  razorpayOrderId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  onSuccess: (orderNumber: string) => void;
  onSwitchToCod: () => Promise<void>;
}

export default function PaymentModal({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  totalAmount,
  upiId,
  upiName,
  isConfigured,
  keyId,
  razorpayOrderId,
  customerName,
  customerPhone,
  customerEmail,
  onSuccess,
  onSwitchToCod,
}: PaymentModalProps) {
  const [activeTab, setActiveTab] = useState<"UPI" | "GATEWAY">("UPI");
  const [utrNumber, setUtrNumber] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [switchingCod, setSwitchingCod] = useState(false);

  useEffect(() => {
    if (isConfigured) {
      setActiveTab("GATEWAY");
    } else {
      setActiveTab("UPI");
    }
  }, [isConfigured]);

  if (!isOpen) return null;

  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    upiName
  )}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent(`Order ${orderNumber}`)}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(
    upiUrl
  )}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleVerifyUtr = async (isTest: boolean = false) => {
    if (!isTest && (!utrNumber.trim() || utrNumber.trim().length < 6)) {
      setError("Please enter your 12-digit UPI transaction reference / UTR number from your payment app.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/payments/verify-upi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          utrNumber: isTest ? "TEST_SIMULATION" : utrNumber.trim(),
          isTest,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Payment verification failed.");
      }

      onSuccess(orderNumber);
    } catch (err: any) {
      setError(err.message || "Failed to verify UPI payment. Please check your reference number.");
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchRazorpay = async () => {
    if (typeof (window as any).Razorpay === "undefined") {
      // Dynamic script fallback
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
      await new Promise((resolve) => {
        script.onload = resolve;
        script.onerror = resolve;
      });
    }

    if (typeof (window as any).Razorpay === "undefined") {
      setError("Razorpay script could not be loaded. Please use the Direct UPI option below.");
      setActiveTab("UPI");
      return;
    }

    try {
      const rzp = new (window as any).Razorpay({
        key: keyId,
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        name: "chocii 4 u",
        description: `Order ${orderNumber}`,
        order_id: razorpayOrderId,
        handler: async function (response: any) {
          try {
            setLoading(true);
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const vData = await verifyRes.json();
            if (vData.success) {
              onSuccess(orderNumber);
            } else {
              setError(vData.error || "Payment verification failed.");
            }
          } catch (e: any) {
            setError(e.message || "Error verifying payment signature.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setError("Payment popup was closed. You can retry Razorpay or scan the UPI QR code below.");
          },
        },
        prefill: {
          name: customerName,
          contact: customerPhone,
          email: customerEmail || undefined,
        },
        theme: { color: "#C58A55" },
      });
      rzp.open();
    } catch (err: any) {
      setError(err.message || "Failed to initialize Razorpay modal.");
    }
  };

  const handleCodSwitch = async () => {
    setSwitchingCod(true);
    setError(null);
    try {
      await onSwitchToCod();
    } catch (e: any) {
      setError(e.message || "Failed to switch to Cash on Delivery.");
      setSwitchingCod(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-cocoa-950 border-2 border-caramel-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-cream-100 space-y-6 my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-cream-300 transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pr-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-caramel-500/15 border border-caramel-500/30 text-caramel-400 text-xs font-bold uppercase tracking-widest font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            Complete Payment
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-cream-100">
            Order #{orderNumber}
          </h2>
          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="text-xs uppercase tracking-wider text-cream-300/70">Total Amount Due:</span>
            <span className="text-2xl sm:text-3xl font-black text-caramel-400 font-mono">
              ₹{totalAmount}
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-strawberry-500/15 border border-strawberry-500/40 text-strawberry-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        {/* Payment Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-cocoa-900 rounded-2xl border border-white/5">
          <button
            type="button"
            onClick={() => setActiveTab("UPI")}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "UPI"
                ? "bg-caramel-500 text-cocoa-950 shadow-md"
                : "text-cream-300 hover:text-cream-100 hover:bg-white/5"
            }`}
          >
            <QrCode className="w-4 h-4" />
            Instant UPI & QR
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("GATEWAY");
              if (isConfigured) {
                handleLaunchRazorpay();
              }
            }}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "GATEWAY"
                ? "bg-caramel-500 text-cocoa-950 shadow-md"
                : "text-cream-300 hover:text-cream-100 hover:bg-white/5"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Cards & NetBanking
          </button>
        </div>

        {/* Tab 1: Instant UPI QR & App */}
        {activeTab === "UPI" && (
          <div className="space-y-5">
            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white border border-stone-300 text-cocoa-950 space-y-3 shadow-md">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56">
                <img
                  src={qrImageUrl}
                  alt={`Scan to pay ₹${totalAmount} to ${upiId}`}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="text-center space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-cocoa-950">
                  Scan With Any UPI App
                </p>
                <p className="text-[11px] text-cocoa-800/70">
                  Google Pay • PhonePe • Paytm • BHIM • CRED
                </p>
              </div>
            </div>

            {/* Mobile 1-Tap Pay Button */}
            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href={upiUrl}
                className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <Smartphone className="w-4 h-4" />
                Tap to Pay in UPI App
              </a>

              <button
                type="button"
                onClick={handleCopyUpi}
                className="py-3 px-4 rounded-xl bg-cocoa-900 hover:bg-cocoa-800 border border-white/10 text-cream-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors font-mono"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-caramel-400" />
                    <span>Copy UPI ID</span>
                  </>
                )}
              </button>
            </div>

            {/* Payee Info */}
            <div className="p-3 rounded-xl bg-cocoa-900/60 border border-white/5 flex items-center justify-between text-xs">
              <span className="text-cream-300/60">Payee VPA:</span>
              <strong className="text-caramel-400 font-mono">{upiId}</strong>
            </div>

            {/* UTR Input Form */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="text-xs font-bold uppercase tracking-wider text-caramel-400 block">
                After Paying, Enter 12-Digit UPI Reference (UTR):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={16}
                  placeholder="e.g. 429182749102"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value.replace(/[^0-9a-zA-Z]/g, ""))}
                  className="flex-1 bg-cocoa-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-cream-100 focus:outline-none focus:border-caramel-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleVerifyUtr(false)}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-caramel-500 hover:bg-caramel-400 text-cocoa-950 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 stroke-[3]" />}
                  Verify
                </button>
              </div>
              <p className="text-[11px] text-cream-300/50">
                Found in your Google Pay / PhonePe / Paytm transaction receipt after paying.
              </p>
            </div>

            {/* Test Simulation Option */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => handleVerifyUtr(true)}
                disabled={loading}
                className="text-[11px] text-cream-300/50 hover:text-caramel-400 underline underline-offset-4 transition-colors"
              >
                [Testing / Demo Mode]: Simulate Instant Payment
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Razorpay Gateway */}
        {activeTab === "GATEWAY" && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-3xl bg-caramel-500/15 border border-caramel-500/30 text-caramel-400 flex items-center justify-center mx-auto">
              <CreditCard className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-serif font-bold text-cream-100">
                Cards, NetBanking & Automated Gateway
              </h3>
              <p className="text-xs text-cream-300/70 max-w-sm mx-auto leading-relaxed">
                Pay securely with Debit/Credit cards, NetBanking, or automated UPI checkout via Razorpay.
              </p>
            </div>

            {isConfigured ? (
              <button
                type="button"
                onClick={handleLaunchRazorpay}
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-caramel-500 to-caramel-600 hover:from-caramel-400 hover:to-caramel-500 text-cocoa-950 font-bold uppercase tracking-wider text-xs shadow-xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
                Launch Razorpay Checkout (₹{totalAmount})
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-cocoa-900/60 border border-caramel-500/20 text-xs text-cream-300/80 space-y-3">
                <p>
                  Razorpay card keys are currently in setup mode. Please use the <strong>Instant UPI & QR</strong> tab above to pay directly via Google Pay, PhonePe, or Paytm.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("UPI")}
                  className="px-4 py-2 rounded-xl bg-caramel-500 text-cocoa-950 font-bold text-xs uppercase tracking-wider"
                >
                  Switch to Instant UPI QR
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer: Switch to COD */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={handleCodSwitch}
            disabled={switchingCod}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-cream-300/70 hover:text-cream-100 transition-colors py-2 text-xs font-semibold"
          >
            <Banknote className="w-4 h-4 text-caramel-400" />
            {switchingCod ? "Switching to Cash on Delivery..." : "Prefer Cash on Delivery? Pay upon arrival"}
          </button>

          <div className="flex items-center gap-1.5 text-[11px] text-cream-300/40">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-bit Secure Session</span>
          </div>
        </div>
      </div>
    </div>
  );
}
