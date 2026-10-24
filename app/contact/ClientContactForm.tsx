"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export default function ClientContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("Bulk / Event Catering");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please provide your name.");
      return;
    }

    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setError("Please provide a valid 10-digit phone number.");
      return;
    }

    if (!message.trim() || message.trim().length < 5) {
      setError("Please enter your message.");
      return;
    }

    setLoading(true);

    // Simulate sending message to cloud kitchen dispatch inbox
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 700);
  };

  if (submitted) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#EADCCE] text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-serif font-black text-cocoa-950">
          Message Received!
        </h3>
        <p className="text-xs sm:text-sm text-cocoa-900/80 font-normal max-w-md mx-auto leading-relaxed">
          Thank you, <strong>{name}</strong>. Our kitchen manager has received your note regarding <em>"{subject}"</em> and will reply to <strong>{phone}</strong> within 30 minutes.
        </p>
        <div className="pt-4">
          <button
            onClick={() => {
              setSubmitted(false);
              setMessage("");
            }}
            className="px-6 py-2.5 rounded-full bg-cocoa-950 hover:bg-cocoa-900 text-xs font-bold uppercase tracking-wider text-white transition-colors"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#EADCCE] space-y-6 shadow-sm">
      <div className="space-y-1">
        <h3 className="text-xl font-serif font-bold text-cocoa-950">
          Send Us a Note
        </h3>
        <p className="text-xs text-cocoa-900/70 font-normal">
          Fill out the details below and we'll connect with you directly.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-strawberry-500/10 border border-strawberry-500/30 text-strawberry-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-cocoa-950 font-bold uppercase tracking-wider text-[11px]">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EADCCE] text-cocoa-950 text-sm focus:outline-none focus:border-caramel-500 transition-colors placeholder:text-cocoa-950/40"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-cocoa-950 font-bold uppercase tracking-wider text-[11px]">
              Phone Number *
            </label>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 86883 67177"
              className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EADCCE] text-cocoa-950 text-sm focus:outline-none focus:border-caramel-500 transition-colors placeholder:text-cocoa-950/40"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-cocoa-950 font-bold uppercase tracking-wider text-[11px]">
              Email Address (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="priya@example.com"
              className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EADCCE] text-cocoa-950 text-sm focus:outline-none focus:border-caramel-500 transition-colors placeholder:text-cocoa-950/40"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-cocoa-950 font-bold uppercase tracking-wider text-[11px]">
              Subject *
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EADCCE] text-cocoa-950 text-sm focus:outline-none focus:border-caramel-500 transition-colors"
            >
              <option value="Bulk / Event Catering">Bulk / Event Catering</option>
              <option value="Delivery Status Inquiry">Delivery Status Inquiry</option>
              <option value="Allergen & Recipe Question">Allergen & Recipe Question</option>
              <option value="Feedback / Compliment">Feedback / Compliment</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-cocoa-950 font-bold uppercase tracking-wider text-[11px]">
            Message *
          </label>
          <textarea
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what you crave or how we can assist..."
            className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EADCCE] text-cocoa-950 text-sm focus:outline-none focus:border-caramel-500 transition-colors resize-none placeholder:text-cocoa-950/40"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-full bg-cocoa-950 hover:bg-cocoa-900 text-white font-bold uppercase tracking-wider text-xs shadow-xl shadow-cocoa-950/15 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin text-caramel-400" />
          ) : (
            <>
              <Send className="w-4 h-4 text-caramel-400" />
              <span>Submit Message to Kitchen</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
