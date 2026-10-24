import React from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import ClientFaqPage from "./ClientFaqPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions & Allergen Info | chocii 4 u",
  description:
    "Find answers to common questions about chocii 4 u: menu items, ingredients, delivery, reheating guides, and storage.",
  openGraph: {
    title: "FAQ & Allergen Information | chocii 4 u",
    description: "Learn about our desserts, ingredients, delivery, packaging, and shelf life.",
    url: "https://chocii4u.com/faq",
  },
  alternates: {
    canonical: "https://chocii4u.com/faq",
  },
};

const FAQ_ITEMS = [
  {
    category: "Ingredients & Allergens",
    question: "What ingredients are used in your desserts?",
    answer:
      "We prepare our desserts using cocoa, dairy, wheat flour, and sugar. Please review individual item details on the menu for specific ingredients and allergen notes before ordering.",
  },
  {
    category: "Ingredients & Allergens",
    question: "Do your desserts contain nuts or nut traces?",
    answer:
      "Some items (like our Hazelnut Crunch Dream Cake add-on and Roasted Hazelnut toppings) contain tree nuts (hazelnuts, almonds, pistachios). While items without nuts are prepared with clean utensils, our kitchen handles nuts, so cross-contact may occur.",
  },
  {
    category: "Delivery & Packaging",
    question: "How are desserts packaged for delivery?",
    answer:
      "All orders are packed in secure, food-grade containers designed to protect your desserts during transit so they arrive intact and fresh.",
  },
  {
    category: "Delivery & Packaging",
    question: "How should I enjoy warm desserts like Choco Churros?",
    answer:
      "Churros are packaged in protective boxes to preserve warmth and crispness. The dark and white chocolate dips are sealed in separate cups so they are ready for dipping.",
  },
  {
    category: "Storage & Shelf Life",
    question: "How should I store the Dream Cake if I don't finish it immediately?",
    answer:
      "Keep the Dream Cake refrigerated between 2°C – 5°C. It stays delicious for up to 48 hours. We recommend enjoying it chilled straight out of the fridge so the dark chocolate shell stays firm.",
  },
  {
    category: "Storage & Shelf Life",
    question: "Can I warm the Dream Bowl brownie?",
    answer:
      "Yes! Remove the lid, place the brownie bowl in a microwave for 15–20 seconds on medium power to gently warm the chocolate ganache.",
  },
  {
    category: "Ordering & Payments",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major UPI apps (Google Pay, PhonePe, Paytm), credit/debit cards, net banking via Razorpay, as well as Cash on Delivery across Visakhapatnam.",
  },
  {
    category: "Ordering & Customization",
    question: "What is the difference between Classic and Balanced customization?",
    answer:
      "Classic offers our rich, indulgent dessert sweetness profile. Balanced reduces overall sweetness to emphasize deeper cocoa notes for a less sweet, chocolate-forward treat.",
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-cocoa-950 flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="flex-grow pt-28 pb-24">
        <ClientFaqPage faqItems={FAQ_ITEMS} />
      </main>

      <Footer />
    </div>
  );
}
