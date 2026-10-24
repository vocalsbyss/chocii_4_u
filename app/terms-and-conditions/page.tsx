import React from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | chocii 4 u",
  description:
    "Terms and Conditions governing the use of chocii 4 u online ordering platform, cloud kitchen dispatch, and payment terms.",
  alternates: {
    canonical: "https://chocii4u.com/terms-and-conditions",
  },
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-cocoa-950 text-cream-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-28 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="border-b border-white/10 pb-6 space-y-2">
            <span className="text-xs uppercase tracking-widest text-caramel-400 font-bold">
              Terms of Service
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-cream-100">
              Terms & Conditions
            </h1>
            <p className="text-xs text-cream-300/60 font-mono">
              Effective Date: October 2026
            </p>
          </div>

          <div className="space-y-8 text-xs sm:text-sm text-cream-200/80 font-light leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-cream-100">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing, browsing, or placing an order through the chocii 4 u website (chocii4u.com), you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree, please discontinue using the platform.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-cream-100">
                2. Ordering & Verification
              </h2>
              <p>
                All dessert orders must be placed with a verified 10-digit Indian mobile number. You agree to provide accurate recipient details, complete street addresses, and reachable contact numbers. chocii 4 u reserves the right to reject orders with fraudulent contact numbers, unreachable locations, or repeatedly canceled cash-on-delivery requests.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-cream-100">
                3. Pricing, Availability & Customizations
              </h2>
              <p>
                All prices are displayed in Indian Rupees (INR) and are inclusive of applicable goods and services tax (GST). While we endeavor to maintain real-time menu availability, certain limited-batch items may sell out during peak evening hours. If an ordered item becomes unavailable before dispatch, our kitchen will immediately notify you to select a delicious substitute or arrange a priority replacement item.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-cream-100">
                4. Food Consumption & Perishability
              </h2>
              <p>
                Our desserts are artisanal food products made without artificial preservatives. Chilled products (such as the Dream Cake and Fruizy) must be refrigerated upon receipt. Warm items (such as Choco Churros) are best consumed fresh within 30 minutes of arrival. chocii 4 u is not responsible for spoilage resulting from improper storage after successful delivery.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-cream-100">
                5. Governing Law & Jurisdiction
              </h2>
              <p>
                These Terms and Conditions shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts in Visakhapatnam, Andhra Pradesh.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
