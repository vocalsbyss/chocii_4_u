"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  ArrowRight,
  ShoppingBag,
  MapPin,
  User,
  Phone,
  AlertCircle,
  RefreshCw,
  Lock,
  Gift,
  Tag,
  Check,
  X,
} from "lucide-react";
import { getStoredCart, calculateCartSummary, clearCart } from "@/lib/cart";
import { CartItem } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<{ name: string; phone: string } | null>(
    null
  );
  const [authChecking, setAuthChecking] = useState(true);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"CASH_ON_DELIVERY" | "RAZORPAY">(
    "CASH_ON_DELIVERY"
  );

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Coupon & Offers State
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    description: string;
    discountType: string;
    discountValue: number;
    discountAmount: number;
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // 1. Verify Customer Session (Mandatory Customer Authentication)
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCustomer(data.user);
          setFullName(data.user.name);
          setPhone(data.user.phone);
          if (data.user.email) {
            setEmail(data.user.email);
          }
        } else {
          // Redirect unauthenticated user to OTP sign-in preserving checkout target
          router.push("/sign-in?redirect=/checkout");
        }
      })
      .catch(() => {
        router.push("/sign-in?redirect=/checkout");
      })
      .finally(() => {
        setAuthChecking(false);
      });
  }, [router]);

  // 2. Load Cart
  useEffect(() => {
    const currentCart = getStoredCart();
    setCart(currentCart);
  }, []);

  const summary = calculateCartSummary(cart);

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalGrandTotal = Math.max(0, summary.grandTotal - discountAmount);

  const handleApplyCoupon = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!couponCodeInput.trim()) return;

    setCouponLoading(true);
    setCouponError(null);
    setCouponSuccess(null);

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCodeInput.trim(),
          subtotal: summary.subtotal,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Invalid coupon code.");
      }

      setAppliedCoupon(data.coupon);
      setCouponSuccess(`Coupon "${data.coupon.code}" applied! You saved ₹${data.coupon.discountAmount}.`);
    } catch (err: any) {
      setCouponError(err.message || "Failed to apply coupon.");
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput("");
    setCouponError(null);
    setCouponSuccess(null);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (cart.length === 0) {
      setErrorMessage("Your cart is empty. Please add desserts before ordering.");
      return;
    }

    if (!deliveryAddress.trim() || deliveryAddress.trim().length < 6) {
      setErrorMessage("Please enter your complete delivery address.");
      return;
    }

    setLoading(true);

    try {
      // Create Order on Server (Server validates DB prices & availability)
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: fullName.trim(),
          customerPhone: phone.trim(),
          customerEmail: email.trim() || undefined,
          deliveryAddress: deliveryAddress.trim(),
          landmark: landmark.trim() || undefined,
          specialInstructions: deliveryInstructions.trim() || undefined,
          paymentMethod,
          couponCode: appliedCoupon ? appliedCoupon.code : undefined,
          items: cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            customization: item.customization,
            selectedAddons: item.selectedAddons,
            specialInstructions: item.specialInstructions,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to place order.");
      }

      // If Razorpay online payment selected
      if (paymentMethod === "RAZORPAY") {
        const payInitRes = await fetch("/api/payments/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: data.order.id }),
        });
        const payData = await payInitRes.json();

        if (payData.isConfigured && typeof (window as any).Razorpay !== "undefined") {
          // Open real Razorpay checkout modal
          const rzp = new (window as any).Razorpay({
            key: payData.keyId,
            amount: payData.amount,
            currency: payData.currency,
            name: "chocii 4 u",
            description: `Order ${data.order.orderNumber}`,
            order_id: payData.razorpayOrderId,
            handler: async function (response: any) {
              await fetch("/api/payments/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: data.order.id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });
              clearCart();
              router.push(`/order-success/${data.order.orderNumber}`);
            },
            prefill: {
              name: fullName,
              contact: phone,
              email: email || undefined,
            },
            theme: { color: "#C58A55" },
          });
          rzp.open();
          return;
        }
      }

      // Order saved in database! Clear cart and route to order confirmation
      clearCart();
      router.push(`/order-success/${data.order.orderNumber}`);
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while placing your order.");
    } finally {
      setLoading(false);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-cocoa-950 flex items-center justify-center text-cream-100">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-caramel-400 animate-spin mx-auto" />
          <p className="text-sm font-medium">Verifying customer authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cocoa-950 text-cream-100 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-caramel-400 font-bold">
              Secure Delivery Checkout
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-cream-100">
              Complete Your Order
            </h1>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-strawberry-500/15 border border-strawberry-500/40 text-strawberry-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Customer Info, Address, Payment Method */}
            <div className="lg:col-span-7 space-y-6">
              {/* Customer Info Card */}
              <div className="bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 className="text-base font-serif font-bold text-cream-100 flex items-center gap-2">
                    <User className="w-4 h-4 text-caramel-400" />
                    Customer Details (Verified via OTP)
                  </h3>
                  <span className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                    Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-caramel-400">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-cream-100 focus:outline-none focus:border-caramel-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-caramel-400">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={phone}
                      className="w-full bg-cocoa-950/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-cream-300/60 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-caramel-400">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="For digital order invoice & receipts"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-cream-100 placeholder:text-cream-300/30 focus:outline-none focus:border-caramel-500"
                  />
                </div>
              </div>

              {/* Delivery Address Card */}
              <div className="bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-serif font-bold text-cream-100 flex items-center gap-2 border-b border-white/5 pb-3">
                  <MapPin className="w-4 h-4 text-caramel-400" />
                  Delivery Destination
                </h3>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-caramel-400">
                    Street Address & Flat / House No. *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. Flat 402, Sai Residency, Near Muralinagar, Madhavadhara, Visakhapatnam"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-cream-100 placeholder:text-cream-300/30 focus:outline-none focus:border-caramel-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-caramel-400">
                      Nearby Landmark
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Near Metro Station / Behind Cafe"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-cream-100 placeholder:text-cream-300/30 focus:outline-none focus:border-caramel-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-caramel-400">
                      Rider Delivery Instructions
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ring the bell, leave at security"
                      value={deliveryInstructions}
                      onChange={(e) => setDeliveryInstructions(e.target.value)}
                      className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-cream-100 placeholder:text-cream-300/30 focus:outline-none focus:border-caramel-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-serif font-bold text-cream-100 flex items-center gap-2 border-b border-white/5 pb-3">
                  <Lock className="w-4 h-4 text-caramel-400" />
                  Select Payment Method
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Cash on Delivery */}
                  <label
                    onClick={() => setPaymentMethod("CASH_ON_DELIVERY")}
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === "CASH_ON_DELIVERY"
                        ? "border-caramel-500 bg-caramel-500/15 ring-1 ring-caramel-500"
                        : "border-white/10 bg-cocoa-950/40 hover:border-white/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "CASH_ON_DELIVERY"}
                      onChange={() => setPaymentMethod("CASH_ON_DELIVERY")}
                      className="mt-1 text-caramel-500 focus:ring-caramel-500"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-caramel-400" />
                        <span className="text-xs font-bold text-cream-100">
                          Cash / UPI on Delivery
                        </span>
                      </div>
                      <p className="text-[11px] text-cream-300/60 mt-1">
                        Pay to the delivery partner in cash or scan QR upon arrival.
                      </p>
                    </div>
                  </label>

                  {/* Online Payment (Razorpay) */}
                  <label
                    onClick={() => setPaymentMethod("RAZORPAY")}
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === "RAZORPAY"
                        ? "border-caramel-500 bg-caramel-500/15 ring-1 ring-caramel-500"
                        : "border-white/10 bg-cocoa-950/40 hover:border-white/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "RAZORPAY"}
                      onChange={() => setPaymentMethod("RAZORPAY")}
                      className="mt-1 text-caramel-500 focus:ring-caramel-500"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-caramel-400" />
                        <span className="text-xs font-bold text-cream-100">
                          Razorpay (Cards / UPI / NetBanking)
                        </span>
                      </div>
                      <p className="text-[11px] text-cream-300/60 mt-1">
                        Fast, encrypted online checkout via Razorpay gateway.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Order Summary Breakdown */}
            <div className="lg:col-span-5 bg-cocoa-900/80 border border-caramel-500/30 rounded-3xl p-6 space-y-6 shadow-2xl sticky top-28">
              <h3 className="text-lg font-serif font-bold text-cream-100 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-caramel-400" />
                Order Summary ({summary.totalItemCount} items)
              </h3>

              {/* Items List Snapshot */}
              <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
                {cart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex items-center gap-3 py-2 border-b border-white/5"
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                        unoptimized={Boolean(item.imageUrl?.startsWith("data:"))}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-cream-100 truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-caramel-300/80">
                        {item.customization} • Qty {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-cream-100">
                      ₹{item.lineTotal}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Code Section */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-caramel-400 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-caramel-400" />
                  Have a Coupon or Offer Code?
                </label>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-emerald-400 tracking-wide font-mono">
                          {appliedCoupon.code}
                        </span>
                        <p className="text-[10px] text-emerald-300/80">
                          {appliedCoupon.description || `₹${appliedCoupon.discountAmount} discount applied`}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="p-1 rounded-lg text-cream-300/60 hover:text-strawberry-400 hover:bg-strawberry-500/10 transition-colors"
                      title="Remove coupon"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. FESTIVE20, SWEET10"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleApplyCoupon();
                        }
                      }}
                      className="flex-1 bg-cocoa-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono uppercase tracking-wider text-cream-100 placeholder:text-cream-300/30 focus:outline-none focus:border-caramel-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon()}
                      disabled={couponLoading || !couponCodeInput.trim()}
                      className="px-4 py-2 bg-caramel-500/20 hover:bg-caramel-500/30 border border-caramel-500/40 text-caramel-300 font-bold text-xs rounded-xl transition-all disabled:opacity-40"
                    >
                      {couponLoading ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        "Apply"
                      )}
                    </button>
                  </div>
                )}

                {couponError && (
                  <p className="text-[11px] text-strawberry-400 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {couponError}
                  </p>
                )}
                {couponSuccess && !appliedCoupon && (
                  <p className="text-[11px] text-emerald-400 font-medium">
                    {couponSuccess}
                  </p>
                )}
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-2 text-xs text-cream-200 border-t border-white/10 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-cream-100">₹{summary.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="font-semibold text-cream-100">
                    {summary.deliveryFee === 0 ? (
                      <span className="text-emerald-400">FREE</span>
                    ) : (
                      `₹${summary.deliveryFee}`
                    )}
                  </span>
                </div>

                {appliedCoupon && discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Coupon Discount ({appliedCoupon.code})
                    </span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-bold text-cream-100 pt-3 border-t border-white/10">
                  <span>Grand Total</span>
                  <span className="text-caramel-400 text-lg">₹{finalGrandTotal}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || cart.length === 0}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-caramel-500 to-caramel-600 hover:from-caramel-400 hover:to-caramel-500 text-cocoa-950 font-bold uppercase tracking-wider text-xs shadow-xl shadow-caramel-500/25 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Saving Order & Notifying Kitchen...
                  </>
                ) : (
                  <>
                    Place Order Directly (₹{finalGrandTotal})
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center flex items-center justify-center gap-1.5 text-[11px] text-cream-300/50">
                <ShieldCheck className="w-3.5 h-3.5 text-caramel-400" />
                <span>Orders are saved in the kitchen database and monitored in real time</span>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
