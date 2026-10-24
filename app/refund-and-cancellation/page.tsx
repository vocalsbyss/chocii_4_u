import React from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { RefreshCcw, ShieldAlert, CheckCircle, Phone, PackageCheck, AlertCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Replacement & Cancellation Policy | chocii 4 u",
  description:
    "Replacement and cancellation policy for chocii 4 u. We do not offer refunds; damaged products are eligible for an immediate priority replacement.",
  alternates: {
    canonical: "https://chocii4u.com/refund-and-cancellation",
  },
};

export default function RefundAndCancellationPage() {
  return (
    <div className="min-h-screen bg-cocoa-950 text-cream-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-28 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="border-b border-white/10 pb-6 space-y-2">
            <span className="text-xs uppercase tracking-widest text-caramel-400 font-bold">
              Customer Assurance
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-cream-100">
              Replacement & Cancellation Policy
            </h1>
            <p className="text-xs text-cream-300/60 font-mono">
              Last Updated: October 2026 • Strict No-Refund & Replacement Only Policy
            </p>
          </div>

          {/* Core Notice Banner */}
          <div className="p-5 sm:p-6 rounded-2xl bg-caramel-500/10 border border-caramel-500/30 flex items-start gap-3.5 text-xs text-cream-100 leading-relaxed">
            <AlertCircle className="w-5 h-5 text-caramel-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-caramel-300 font-semibold uppercase tracking-wider block mb-1">
                Important Policy Notice
              </strong>
              Due to the freshly prepared, perishable nature of our artisanal desserts, <strong>we do not offer monetary refunds under any circumstances</strong>. If an item arrives damaged or compromised during transit, we provide an <strong>immediate free replacement</strong>.
            </div>
          </div>

          <div className="space-y-8 text-xs sm:text-sm text-cream-200/80 font-light leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-cream-100 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-caramel-400" />
                1. No Refund Policy
              </h2>
              <p>
                All orders placed through chocii 4 u are freshly crafted and assembled specifically for you. Once an order is placed and enters our kitchen workflow, <strong>no refunds (full or partial) will be issued</strong>.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-cream-200/70">
                <li>Refunds are not granted for changes of mind, incorrect delivery details provided by the customer, or subjective taste preferences.</li>
                <li>Refunds are not granted if the recipient is unavailable to receive the package at the time of delivery.</li>
                <li>Monetary refunds are not provided for canceled orders once preparation has begun.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-cream-100 flex items-center gap-2">
                <RefreshCcw className="w-5 h-5 text-emerald-400" />
                2. Free Replacement for Damaged Items
              </h2>
              <p>
                We stand behind the quality of our craftsmanship and take every precaution to package your orders in sturdy, food-grade containers. If your item arrives physically damaged, spilled, or compromised due to delivery handling:
              </p>
              <div className="p-5 rounded-2xl bg-cocoa-900/60 border border-white/10 space-y-3">
                <p className="font-semibold text-cream-100 text-xs uppercase tracking-wider">
                  How to Claim Your Replacement:
                </p>
                <ol className="list-decimal pl-5 space-y-2 text-cream-200/80 text-xs">
                  <li>
                    <strong>Photograph the Damage:</strong> Take clear photographs or a short video showing the damaged dessert and the outer delivery packaging within <strong>30 minutes of delivery</strong>.
                  </li>
                  <li>
                    <strong>Contact Us Instantly:</strong> Send the photos with your Order Number (e.g. <code>CB-261024-758</code>) to our WhatsApp Hotline at <strong className="text-emerald-400">+91 86883 67177</strong> or email <strong className="text-caramel-400">sidsuresh7264@gmail.com</strong>.
                  </li>
                  <li>
                    <strong>Priority Remake & Dispatch:</strong> Once verified by our kitchen manager, a fresh replacement item will be prepared immediately with top priority and dispatched directly to your location at <strong>zero extra charge</strong>.
                  </li>
                </ol>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-cream-100 flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-caramel-400" />
                3. Order Cancellation Guidelines
              </h2>
              <p>
                Because our chefs immediately begin prepping, frying churros, melting chocolate, or assembling chilled layers upon receiving an order:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-cream-200/70">
                <li>
                  <strong className="text-cream-100">Within 5 Minutes of Placing:</strong> If you placed an order in error, contact our WhatsApp hotline immediately within 5 minutes. If preparation has not started, our team can help you modify the items.
                </li>
                <li>
                  <strong className="text-cream-100">Once in "PREPARING", "READY", or "OUT_FOR_DELIVERY":</strong> Orders cannot be canceled or modified, and no refunds or credits are issued as the fresh food cannot be restocked.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-cream-100 flex items-center gap-2">
                <Phone className="w-5 h-5 text-emerald-400" />
                4. Need Assistance?
              </h2>
              <p>
                For any concerns regarding transit damage or your order status, reach out directly to our kitchen team:
              </p>
              <div className="p-4 rounded-2xl bg-cocoa-900/60 border border-white/10 font-mono text-xs text-cream-100 space-y-1">
                <p>WhatsApp / Call: <a href="tel:+918688367177" className="text-emerald-400 hover:underline">+91 86883 67177</a></p>
                <p>Email: <a href="mailto:sidsuresh7264@gmail.com" className="text-caramel-400 hover:underline">sidsuresh7264@gmail.com</a></p>
                <p>Kitchen: Varma Complex, Muralinagar, Madhavadhara, Visakhapatnam</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
