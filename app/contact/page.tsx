import React from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import ClientContactForm from "./ClientContactForm";
import FloatingChocolateCanvas from "@/components/3d/FloatingChocolateCanvas";
import { Phone, Mail, MapPin, Clock, MessageSquare, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Kitchen Hub | chocii 4 u",
  description:
    "Reach out to chocii 4 u: Cloud kitchen headquarters in Muralinagar, Madhavadhara, Visakhapatnam. Hotline: +91 86883 67177. Open daily 12:00 PM – 01:00 AM.",
  openGraph: {
    title: "Contact & Kitchen Hub | chocii 4 u",
    description: "Connect with our cloud kitchen team for orders, queries, and bulk catering.",
    url: "https://chocii4u.com/contact",
  },
  alternates: {
    canonical: "https://chocii4u.com/contact",
  },
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact chocii 4 u",
    url: "https://chocii4u.com/contact",
    mainEntity: {
      "@type": "LocalBusiness",
      name: "chocii 4 u Cloud Kitchen",
      telephone: "+91-8688367177",
      email: "sidsuresh7264@gmail.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Varma Complex, Muralinagar, Madhavadhara",
        addressLocality: "Visakhapatnam",
        addressRegion: "Andhra Pradesh",
        postalCode: "530007",
        addressCountry: "IN",
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "12:00",
        closes: "01:00",
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-cocoa-950 flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="flex-grow pt-28 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {/* Header Banner */}
          <div className="rounded-3xl border border-[#EADCCE] bg-gradient-to-b from-white via-[#FFFDF9] to-[#F5EEE6] p-8 sm:p-10 shadow-sm relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-caramel-500/10 border border-caramel-500/30 text-caramel-700 text-[11px] font-bold uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 text-caramel-600" />
                  Direct Kitchen Hotline
                </div>
                <h1 className="text-3xl sm:text-5xl font-serif font-black text-cocoa-950 tracking-tight">
                  Get in Touch with chocii 4 u
                </h1>
                <p className="text-sm sm:text-base text-cocoa-900/80 font-normal max-w-2xl leading-relaxed">
                  Have a question about allergens, bulk catering, party boxes, or delivery tracking? Our kitchen team is always listening.
                </p>
              </div>

              {/* 3D Chocolate Visual */}
              <div className="lg:col-span-5 h-[200px] sm:h-[240px] rounded-2xl overflow-hidden relative border border-[#EADCCE] bg-white shadow-sm">
                <FloatingChocolateCanvas
                  variant="ambient"
                  className="h-full w-full"
                  badgeText="Live 3D Chocolate Hub"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Contact Details Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-3xl bg-white border border-[#EADCCE] space-y-6 shadow-sm">
                <h3 className="text-xl font-serif font-bold text-cocoa-950">
                  Kitchen Headquarters
                </h3>

                <div className="space-y-4 text-xs sm:text-sm text-cocoa-900/80 font-normal">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-caramel-500/20 text-caramel-700 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-cocoa-950">Phone & WhatsApp</p>
                      <a href="tel:+918688367177" className="hover:text-caramel-700 font-mono font-medium">
                        +91 86883 67177
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-caramel-500/20 text-caramel-700 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-cocoa-950">Email Address</p>
                      <a href="mailto:sidsuresh7264@gmail.com" className="hover:text-caramel-700 font-medium">
                        sidsuresh7264@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-caramel-500/20 text-caramel-700 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-cocoa-950">Location</p>
                      <p>Varma Complex, Muralinagar</p>
                      <p>Madhavadhara, Visakhapatnam, Andhra Pradesh, India</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-caramel-500/20 text-caramel-700 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-cocoa-950">Operating Hours</p>
                      <p className="font-mono font-medium">12:00 PM – 01:00 AM</p>
                      <p className="text-[11px] text-cocoa-800/60">Every single day including weekends & holidays</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EADCCE]">
                  <a
                    href="https://wa.me/918688367177"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-[#25D366]/20"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Chat with Kitchen Manager
                  </a>
                </div>
              </div>
            </div>

            {/* Interactive Form Column */}
            <div className="lg:col-span-7">
              <ClientContactForm />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
