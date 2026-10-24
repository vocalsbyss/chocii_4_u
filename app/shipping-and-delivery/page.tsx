import React from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { Truck, ShieldCheck, Clock, MapPin, PackageCheck, AlertCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | chocii 4 u",
  description:
    "Learn about chocii 4 u's delivery process in Visakhapatnam: packaging, operating hours, and delivery coverage.",
  alternates: {
    canonical: "https://chocii4u.com/shipping-and-delivery",
  },
};

export default function ShippingAndDeliveryPage() {
  return (
    <div className="min-h-screen bg-cocoa-950 text-cream-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-28 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="border-b border-white/10 pb-6 space-y-2">
            <span className="text-xs uppercase tracking-widest text-caramel-400 font-bold">
              Dispatch & Logistics
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-cream-100">
              Shipping & Delivery Policy
            </h1>
            <p className="text-xs text-cream-300/60 font-mono">
              Last Updated: October 2026
            </p>
          </div>

          {/* Quick Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-cocoa-900/60 border border-white/10 space-y-2">
              <Clock className="w-5 h-5 text-caramel-400" />
              <h3 className="font-bold text-cream-100 text-sm">Prompt Dispatch</h3>
              <p className="text-xs text-cream-200/70 font-light">
                Assembled and dispatched directly from our central kitchen.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-cocoa-900/60 border border-white/10 space-y-2">
              <PackageCheck className="w-5 h-5 text-caramel-400" />
              <h3 className="font-bold text-cream-100 text-sm">Protective Packaging</h3>
              <p className="text-xs text-cream-200/70 font-light">
                Food-grade packaging containers designed to protect your desserts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-cocoa-900/60 border border-white/10 space-y-2">
              <Truck className="w-5 h-5 text-caramel-400" />
              <h3 className="font-bold text-cream-100 text-sm">Midnight Delivery</h3>
              <p className="text-xs text-cream-200/70 font-light">
                Operating daily from 12:00 PM until 01:00 AM for late-night cravings.
              </p>
            </div>
          </div>

          <div className="space-y-8 text-xs sm:text-sm text-cream-200/80 font-light leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-cream-100">
                1. Delivery Coverage Area
              </h2>
              <p>
                We currently service the Visakhapatnam urban and coastal areas from our Muralinagar, Madhavadhara central kitchen hub, including:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-cream-200/70">
                <li><strong className="text-cream-100">Zone A (Central Hub):</strong> Muralinagar, Madhavadhara, Kancharapalem, Akkayyapalem, NAD Junction, Marripalem.</li>
                <li><strong className="text-cream-100">Zone B (City & Coastal):</strong> Dwaraka Nagar, Siripuram, Asilmetta, Jagadamba, MVP Colony, Seethammadhara.</li>
                <li><strong className="text-cream-100">Zone C (Extended Reach):</strong> Rushikonda, Lawsons Bay Beach, Gajuwaka, Pendurthi, PM Palem.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-cream-100">
                2. Protective Packaging
              </h2>
              <p>
                Delivering chocolate desserts requires thoughtful packaging to ensure every order arrives intact:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-cream-200/70">
                <li>
                  <strong className="text-cream-100">Chilled Items (Dream Cake, Fruizy, Can Cake):</strong> Sealed in sturdy food-grade containers to protect desserts during transit.
                </li>
                <li>
                  <strong className="text-cream-100">Warm Items (Choco Churros, Dream Bowl):</strong> Packed in secure containers with sauces packed separately for convenient dipping.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-cream-100">
                3. Delivery Charges
              </h2>
              <p>
                Standard delivery is calculated dynamically based on distance from our cloud hub:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-cream-200/70">
                <li>Orders under ₹499: Flat delivery & packaging fee of ₹49.</li>
                <li>Orders above ₹499: <strong className="text-emerald-400">FREE Express Delivery</strong>.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-cream-100">
                4. Unreachable Recipients & Redelivery
              </h2>
              <p>
                Because our desserts are freshly prepared perishable food items, delivery partners will wait up to a maximum of 10 minutes at the designated delivery address. If the recipient cannot be reached by phone, the rider must return to the hub to protect food quality. Redelivery fees may apply in cases of incorrect addresses or unattended locations.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
