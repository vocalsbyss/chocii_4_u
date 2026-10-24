"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight, Instagram, Phone, Shield } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-[#FAF7F2] text-cocoa-900 border-t border-[#EADCCE] pt-20 pb-14 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-14">
        {/* Main 4-Column Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-14">
          {/* Col 1: Kitchen HQ & Cloud Hub */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-mono uppercase tracking-[0.25em] text-caramel-700 font-bold">
              KITCHEN HQ & CLOUD HUB
            </h4>
            <div className="space-y-1.5 text-xs text-cocoa-900/80 font-normal leading-relaxed">
              <p className="text-sm font-semibold text-cocoa-950 font-mono">
                +91 86883 67177
              </p>
              <div className="flex items-center gap-2 pt-0.5">
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-caramel-50/70 border border-caramel-500/30 flex items-center justify-center p-0.5 shrink-0">
                  <Image
                    src="/images/chocii-logo.png"
                    alt="chocii 4 u logo"
                    width={32}
                    height={32}
                    className="object-contain w-full h-full rounded-full"
                  />
                </div>
                <p className="font-semibold text-cocoa-950 text-sm">chocii 4 u</p>
              </div>
              <p className="text-xs italic text-caramel-700 font-serif">“A Little Treat, Just for You.”</p>
              <p>Varma Complex, Muralinagar</p>
              <p>Madhavadhara, Visakhapatnam, Andhra Pradesh, India</p>
              <a
                href="mailto:sidsuresh7264@gmail.com"
                className="text-caramel-700 hover:underline block pt-1 font-medium"
              >
                sidsuresh7264@gmail.com
              </a>
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="text-xs uppercase tracking-wider font-bold text-caramel-700 hover:text-caramel-800 underline underline-offset-4"
                >
                  Contact Form & Directions →
                </Link>
              </div>
            </div>
          </div>

          {/* Col 2: Dispatch, Hours & Delivery Policy */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-mono uppercase tracking-[0.25em] text-caramel-700 font-bold">
              DELIVERY & DISPATCH
            </h4>
            <div className="space-y-1.5 text-xs text-cocoa-900/80 font-normal leading-relaxed">
              <p className="text-sm font-semibold text-cocoa-950 font-mono">
                12:00 PM – 01:00 AM
              </p>
              <p className="font-semibold text-cocoa-950">Midnight Dispatch Queue</p>
              <p>Prompt Local Delivery</p>
              <p>Secure Food Containers</p>
              <div className="pt-1 space-y-1">
                <Link
                  href="/shipping-and-delivery"
                  className="text-caramel-700 hover:underline block font-medium"
                >
                  Shipping & Delivery Policy →
                </Link>
                <Link
                  href="/track-order"
                  className="text-cocoa-800/80 hover:text-caramel-700 hover:underline block"
                >
                  Track Live Delivery →
                </Link>
              </div>
            </div>
          </div>

          {/* Col 3: Explore Collections & Brand */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-mono uppercase tracking-[0.25em] text-caramel-700 font-bold">
              EXPLORE CRAVINGS
            </h4>
            <ul className="space-y-2 text-xs text-cocoa-900/80 font-normal">
              <li>
                <Link href="/menu" className="hover:text-caramel-700 transition-colors">
                  Signature Menu
                </Link>
              </li>
              <li>
                <Link href="/collections/signature-cakes" className="hover:text-caramel-700 transition-colors">
                  Signature Cakes
                </Link>
              </li>
              <li>
                <Link href="/collections/brownie-bowls" className="hover:text-caramel-700 transition-colors">
                  Brownie Bowls
                </Link>
              </li>
              <li>
                <Link href="/collections/signature-classics" className="hover:text-caramel-700 transition-colors">
                  Crispy Churros & Dips
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-caramel-700 transition-colors">
                  Our Brand Story & Craft
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="hover:text-caramel-700 transition-colors font-medium text-caramel-700">
                  Customer Feedback & 3D Reviews
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-caramel-700 transition-colors">
                  FAQs & Allergen Information
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Callout & CTA */}
          <div className="space-y-5">
            <h4 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-cocoa-950 uppercase leading-tight">
              Let’s Crave Something Exceptional
            </h4>
            <p className="text-xs text-cocoa-900/70 leading-relaxed font-normal">
              Prepared in Visakhapatnam. Order direct for dessert delivery.
            </p>
            <div>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-cocoa-950 hover:bg-caramel-500 text-white hover:text-cocoa-950 font-bold uppercase tracking-[0.15em] text-xs shadow-xl shadow-cocoa-950/15 transition-all active:scale-95"
              >
                <span>START YOUR ORDER</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="pt-2 flex items-center gap-4 text-xs text-cocoa-900/70">
              <a
                href="https://instagram.com/chocii4u.official"
                target="_blank"
                rel="noreferrer"
                className="hover:text-caramel-700 flex items-center gap-1.5 font-medium"
              >
                <Instagram className="w-4 h-4 text-caramel-600" />
                <span>Instagram</span>
              </a>
              <a
                href="https://wa.me/918688367177"
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-700 flex items-center gap-1.5 font-medium"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Hotline</span>
              </a>
            </div>
          </div>
        </div>

        {/* Legal & Policy Links Row */}
        <div className="mt-14 pt-8 border-t border-[#EADCCE] flex flex-wrap items-center justify-between gap-4 text-xs text-cocoa-900/60">
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-caramel-700 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-caramel-700 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/shipping-and-delivery" className="hover:text-caramel-700 transition-colors">
              Shipping & Delivery
            </Link>
            <Link href="/refund-and-cancellation" className="hover:text-caramel-700 transition-colors">
              Replacement & Cancellation
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-6">
            <p className="font-normal text-cocoa-900/80">
              Made with passion by{" "}
              <span className="font-semibold text-cocoa-950">
                chocii 4 u
              </span>
              {" "}— A Little Treat, Just for You.
            </p>
            <Link
              href="/admin/login"
              className="text-cocoa-900/40 hover:text-caramel-700 inline-flex items-center gap-1"
            >
              <Shield className="w-3 h-3" /> Staff Portal
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-[11px] text-cocoa-900/50">
          © {new Date().getFullYear()} chocii 4 u. All rights reserved. Cloud Dessert Kitchen, Varma Complex, Muralinagar, Madhavadhara, Visakhapatnam.
        </div>
      </div>
    </footer>
  );
}
