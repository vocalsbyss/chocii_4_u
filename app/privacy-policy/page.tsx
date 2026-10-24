import React from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | chocii 4 u",
  description:
    "Privacy Policy for chocii 4 u. Learn how we handle customer phone numbers, delivery addresses, and payment data securely.",
  alternates: {
    canonical: "https://chocii4u.com/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-cocoa-950 text-cream-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-28 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="border-b border-white/10 pb-6 space-y-2">
            <span className="text-xs uppercase tracking-widest text-caramel-400 font-bold">
              Legal & Compliance
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-cream-100">
              Privacy Policy
            </h1>
            <p className="text-xs text-cream-300/60 font-mono">
              Last Updated: October 2026
            </p>
          </div>

          <div className="space-y-8 text-xs sm:text-sm text-cream-200/80 font-light leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-cream-100">
                1. Overview & Commitment
              </h2>
              <p>
                chocii 4 u (“we”, “us”, or “our”) is committed to protecting the privacy and personal data of our customers in accordance with the Information Technology Act, 2000, and the Digital Personal Data Protection Act of India. This Privacy Policy outlines the information we collect when you order through our website, verify your account via Phone OTP, or interact with our cloud kitchen.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-cream-100">
                2. Information We Collect
              </h2>
              <p>We collect only the necessary details required to fulfill and deliver your dessert orders:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-cream-200/70">
                <li>
                  <strong className="text-cream-100">Contact Information:</strong> Full name and 10-digit Indian mobile number (+91) for OTP verification and dispatch communications.
                </li>
                <li>
                  <strong className="text-cream-100">Delivery Information:</strong> Physical delivery address, landmark, pin code, and delivery instructions for our courier partners.
                </li>
                <li>
                  <strong className="text-cream-100">Order & Transaction History:</strong> Dessert choices, customization (Classic vs. Balanced), selected toppings, and order timestamps.
                </li>
                <li>
                  <strong className="text-cream-100">Payment Information:</strong> We do not store credit card numbers, CVVs, or UPI PINs. All online payments are securely processed through RBI-authorized payment aggregators (e.g., Razorpay).
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-cream-100">
                3. How We Use Your Information
              </h2>
              <p>Your information is used strictly to:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-cream-200/70">
                <li>Verify your customer session through SMS OTP verification.</li>
                <li>Prepare and dispatch temperature-controlled desserts to your exact location.</li>
                <li>Send order confirmation, rider dispatch notifications, and live status updates.</li>
                <li>Provide customer care, feedback resolution, and order replacement assistance.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-cream-100">
                4. Data Security & Storage
              </h2>
              <p>
                All data transmission between your browser and our servers is encrypted using Industry-standard SSL/TLS (HTTPS). Authentication tokens are stored in secure, HTTP-only, SameSite cookies to protect against unauthorized access or cross-site scripting (XSS).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-cream-100">
                5. Contacting the Grievance Officer
              </h2>
              <p>
                If you have questions, wish to delete your account, or request an export of your personal data, contact our Grievance Officer at:
              </p>
              <div className="p-4 rounded-2xl bg-cocoa-900/60 border border-white/10 font-mono text-xs text-cream-100 space-y-1">
                <p>Grievance Officer: Kitchen Administration, chocii 4 u</p>
                <p>Email: sidsuresh7264@gmail.com</p>
                <p>Address: Varma Complex, Muralinagar, Madhavadhara, Visakhapatnam, Andhra Pradesh, India</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
