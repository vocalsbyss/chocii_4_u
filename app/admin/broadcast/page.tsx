"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Megaphone,
  Sparkles,
  Gift,
  Upload,
  Video,
  Image as ImageIcon,
  Send,
  Eye,
  Check,
  Copy,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Users,
  Radio,
  ExternalLink,
  Play,
  X,
  Mail,
  Sliders,
  ChevronRight,
  Flame,
} from "lucide-react";

// Pre-configured festive & promotional presets
const FESTIVE_PRESETS = [
  {
    id: "diwali",
    name: "Diwali Dhamaka",
    occasion: "DIWALI",
    emoji: "🪔",
    title: "Happy Diwali! Spread Sweet Joy with chocii 4 u",
    subject: "🪔 Warm Diwali Wishes & Flat 25% OFF from chocii 4 u",
    message:
      "Wishing you and your loved ones a sparkling, joyous, and luminous Diwali! May this festival of lights brighten your home with happiness and sweet moments.\n\nCelebrate with our gourmet handcrafted Dream Cakes, molten brownie bowls, and rich chocolate creations crafted fresh in Visakhapatnam.\n\n“A Little Treat, Just for You.”",
    offerCode: "DIWALI25",
    discountText: "FLAT 25% OFF ON ALL ORDERS",
    validTill: "Valid throughout Diwali Festive Days",
    ctaText: "Claim Diwali Treat",
    ctaLink: "/#full-menu-section",
  },
  {
    id: "eid",
    name: "Eid Mubarak",
    occasion: "EID",
    emoji: "🌙",
    title: "Eid Mubarak! Sweeten Your Celebrations",
    subject: "🌙 Eid Mubarak from chocii 4 u! Exclusive Sweet Treat Inside",
    message:
      "May the divine blessings of Eid bring peace, happiness, and prosperity to you and your cherished family.\n\nIndulge in our exquisite dessert selections, made with the finest cocoa and fresh artisanal ingredients.\n\n“A Little Treat, Just for You.”",
    offerCode: "EIDMUBARAK",
    discountText: "FLAT 20% OFF ON ALL DESSERTS",
    validTill: "Valid for 48 Hours",
    ctaText: "Order Eid Special",
    ctaLink: "/#full-menu-section",
  },
  {
    id: "christmas",
    name: "Christmas Joy",
    occasion: "CHRISTMAS",
    emoji: "🎄",
    title: "Merry Christmas & Happy Holidays!",
    subject: "🎄 Merry Christmas from chocii 4 u! A Sweet Gift for You",
    message:
      "Tis the season of joy, warmth, and delicious treats! Celebrate the festive magic with our rich chocolate fudge cakes, holiday brownie bowls, and crispy churro hampers.\n\nDelivered fresh to your doorstep in Visakhapatnam.\n\n“A Little Treat, Just for You.”",
    offerCode: "SANTA20",
    discountText: "20% OFF + FREE SWEET ADDON",
    validTill: "Valid through December 31st",
    ctaText: "Enjoy Holiday Treats",
    ctaLink: "/#full-menu-section",
  },
  {
    id: "new_year",
    name: "New Year Celebration",
    occasion: "NEW_YEAR",
    emoji: "🎆",
    title: "Happy New Year! Sweet Beginnings",
    subject: "✨ Happy New Year from chocii 4 u! Sweet Treats for You",
    message:
      "Here's to fresh beginnings, big smiles, and unforgettable sweet moments in the New Year!\n\nKickstart your year with handcrafted artisanal desserts made with pure chocolate and passion.\n\n“A Little Treat, Just for You.”",
    offerCode: "NEWYEAR25",
    discountText: "FLAT 25% OFF ON CELEBRATION BOXES",
    validTill: "Valid for the New Year Week",
    ctaText: "Celebrate New Year",
    ctaLink: "/#full-menu-section",
  },
  {
    id: "holi",
    name: "Holi Sweets",
    occasion: "HOLI",
    emoji: "🎨",
    title: "Happy Holi! Colors of Sweetness",
    subject: "🎨 Splash into Sweet Delights this Holi with chocii 4 u",
    message:
      "Wishing you a vibrant, joyful, and sweet Holi filled with laughter, colorful moments, and delicious treats!\n\nCool down with our chilled Fruizy creations and molten chocolate brownie bowls.",
    offerCode: "HOLISWEETS",
    discountText: "FLAT 20% OFF ON ALL ORDERS",
    validTill: "Valid for Holi Weekend",
    ctaText: "Grab Holi Treats",
    ctaLink: "/#full-menu-section",
  },
  {
    id: "flash_offer",
    name: "Weekend Flash Sale",
    occasion: "OFFER",
    emoji: "⚡",
    title: "Weekend Sweet Craving Flash Offer!",
    subject: "⚡ Weekend Sweet Alert: Flat 20% OFF Today Only!",
    message:
      "Craving artisanal molten chocolate bowls, crispy cinnamon churros, or a refreshing dessert bowl? The weekend is here and so is your special treat!\n\nOrder fresh from our cloud kitchen in Visakhapatnam.\n\n“A Little Treat, Just for You.”",
    offerCode: "WEEKEND20",
    discountText: "FLAT 20% OFF TODAY ONLY",
    validTill: "Valid until Midnight",
    ctaText: "Claim Flash Deal",
    ctaLink: "/#full-menu-section",
  },
  {
    id: "birthday",
    name: "Birthday & Special Wishes",
    occasion: "BIRTHDAY",
    emoji: "🎂",
    title: "Special Celebration Greetings for You",
    subject: "🎂 A Special Celebration Treat from chocii 4 u",
    message:
      "Because you deserve something extraordinary on your special day!\n\nCelebrate with our signature layered cakes, artisan brownie tubs, and handcrafted chocolate bowls crafted just for you.\n\n“A Little Treat, Just for You.”",
    offerCode: "CELEBRATE15",
    discountText: "15% OFF SPECIAL COMPLIMENT",
    validTill: "Valid for 7 Days",
    ctaText: "Order Celebration Cake",
    ctaLink: "/#full-menu-section",
  },
];

interface BroadcastRecord {
  id: string;
  title: string;
  occasion: string;
  subject: string;
  message: string;
  mediaUrl?: string | null;
  mediaType?: "image" | "video" | null;
  offerCode?: string | null;
  discountText?: string | null;
  validTill?: string | null;
  ctaText?: string;
  ctaLink?: string;
  isActiveBanner: boolean;
  sentEmailCount: number;
  totalRecipients: number;
  status: string;
  lastSentAt?: string | null;
  createdAt: string;
}

interface RecipientItem {
  name: string;
  email: string;
  phone?: string;
}

export default function AdminBroadcastPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Campaign Form State
  const [title, setTitle] = useState(FESTIVE_PRESETS[0].title);
  const [occasion, setOccasion] = useState(FESTIVE_PRESETS[0].occasion);
  const [subject, setSubject] = useState(FESTIVE_PRESETS[0].subject);
  const [message, setMessage] = useState(FESTIVE_PRESETS[0].message);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [offerCode, setOfferCode] = useState(FESTIVE_PRESETS[0].offerCode);
  const [discountText, setDiscountText] = useState(FESTIVE_PRESETS[0].discountText);
  const [validTill, setValidTill] = useState(FESTIVE_PRESETS[0].validTill);
  const [ctaText, setCtaText] = useState(FESTIVE_PRESETS[0].ctaText);
  const [ctaLink, setCtaLink] = useState(FESTIVE_PRESETS[0].ctaLink);
  const [isActiveBanner, setIsActiveBanner] = useState(true);

  // File Upload State
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Preview View Mode: "email" | "popup"
  const [previewMode, setPreviewMode] = useState<"email" | "popup">("email");

  // Audience & Broadcast History
  const [broadcasts, setBroadcasts] = useState<BroadcastRecord[]>([]);
  const [recipients, setRecipients] = useState<RecipientItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Sending State
  const [isSending, setIsSending] = useState(false);
  const [sendingProgress, setSendingProgress] = useState<{
    status: string;
    sentCount: number;
    total: number;
  } | null>(null);
  const [sendSuccessMessage, setSendSuccessMessage] = useState("");
  const [sendErrorMessage, setSendErrorMessage] = useState("");
  const [testEmailAddress, setTestEmailAddress] = useState("sidsuresh7264@gmail.com");

  // Copy Feedback
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [copiedCodePreview, setCopiedCodePreview] = useState(false);

  // Fetch broadcasts & audience pool
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/broadcast");
      if (!res.ok) throw new Error("Failed to load broadcast data");
      const data = await res.json();
      setBroadcasts(data.broadcasts || []);
      setRecipients(data.recipients || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Preset Selection
  const applyPreset = (preset: typeof FESTIVE_PRESETS[0]) => {
    setTitle(preset.title);
    setOccasion(preset.occasion);
    setSubject(preset.subject);
    setMessage(preset.message);
    setOfferCode(preset.offerCode);
    setDiscountText(preset.discountText);
    setValidTill(preset.validTill);
    setCtaText(preset.ctaText);
    setCtaLink(preset.ctaLink);
  };

  // Handle File Upload (Picture or Video)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMedia(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload media file");
      }

      setMediaUrl(data.url);
      setMediaType(data.mediaType || (file.type.startsWith("video/") ? "video" : "image"));
    } catch (err: any) {
      setUploadError(err?.message || "Media upload failed");
    } finally {
      setUploadingMedia(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Save Campaign to Database (as Draft or Active Storefront Banner)
  const handleSaveCampaign = async () => {
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subject,
          message,
          occasion,
          mediaUrl: mediaUrl.trim() || null,
          mediaType,
          offerCode: offerCode.trim() || null,
          discountText: discountText.trim() || null,
          validTill: validTill.trim() || null,
          ctaText,
          ctaLink,
          isActiveBanner,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save campaign");

      setSendSuccessMessage(
        isActiveBanner
          ? "Campaign saved and published as Active Storefront Banner & Popup!"
          : "Campaign saved successfully in broadcast history."
      );
      setTimeout(() => setSendSuccessMessage(""), 4000);
      loadData();
    } catch (err: any) {
      setSendErrorMessage(err?.message || "Failed to save campaign");
      setTimeout(() => setSendErrorMessage(""), 4000);
    }
  };

  // Dispatch Broadcast Email
  const handleSendBroadcast = async (testOnly = false) => {
    if (!title || !message) {
      alert("Please fill in both the Title and Message before broadcasting.");
      return;
    }

    if (!testOnly) {
      const confirmSend = confirm(
        `Are you sure you want to broadcast this message to ALL ${recipients.length} customer contacts via email?\n\nSubject: "${subject}"`
      );
      if (!confirmSend) return;
    }

    setIsSending(true);
    setSendSuccessMessage("");
    setSendErrorMessage("");
    setSendingProgress({
      status: testOnly ? "Sending test preview..." : "Broadcasting to all customers...",
      sentCount: 0,
      total: testOnly ? 1 : recipients.length,
    });

    try {
      // First ensure campaign is saved
      const saveRes = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subject,
          message,
          occasion,
          mediaUrl: mediaUrl.trim() || null,
          mediaType,
          offerCode: offerCode.trim() || null,
          discountText: discountText.trim() || null,
          validTill: validTill.trim() || null,
          ctaText,
          ctaLink,
          isActiveBanner,
        }),
      });
      const saveData = await saveRes.json();
      const broadcastId = saveData.broadcast?.id;

      // Execute send
      const sendRes = await fetch("/api/admin/broadcast/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          broadcastId,
          campaign: {
            id: broadcastId,
            title,
            subject,
            message,
            occasion,
            mediaUrl: mediaUrl.trim() || null,
            mediaType,
            offerCode: offerCode.trim() || null,
            discountText: discountText.trim() || null,
            validTill: validTill.trim() || null,
            ctaText,
            ctaLink,
          },
          sendToAll: !testOnly,
          testEmailOnly: testOnly,
          testEmail: testEmailAddress,
        }),
      });

      const sendData = await sendRes.json();
      if (!sendRes.ok) throw new Error(sendData.error || "Failed to dispatch broadcast");

      if (testOnly) {
        setSendSuccessMessage(`Test preview email successfully delivered to ${testEmailAddress}! Check your inbox.`);
      } else {
        setSendSuccessMessage(
          `Broadcast successfully delivered to ${sendData.sentCount} out of ${sendData.totalTargets} customer contacts!`
        );
      }

      loadData();
    } catch (err: any) {
      setSendErrorMessage(err?.message || "Error sending broadcast email");
    } finally {
      setIsSending(false);
      setSendingProgress(null);
    }
  };

  // Toggle Active Banner status for an existing campaign
  const handleToggleBanner = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/broadcast/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActiveBanner: !currentStatus }),
      });
      if (!res.ok) throw new Error("Failed to update banner status");
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Campaign
  const handleDeleteCampaign = async (id: string, campaignTitle: string) => {
    if (!confirm(`Are you sure you want to delete campaign "${campaignTitle}"?`)) return;
    try {
      const res = await fetch(`/api/admin/broadcast/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Copy WhatsApp Formatted Broadcast Text
  const handleCopyWhatsAppText = () => {
    const formatted = `*${title}* 🍫✨\n\nDear Foodie Friend,\n\n${message}\n\n${
      offerCode ? `🎁 *EXCLUSIVE VOUCHER:* Use Code *${offerCode}* for *${discountText || "Flat Discount"}*!\n` : ""
    }${validTill ? `⏰ _${validTill}_\n\n` : "\n"}${
      mediaUrl ? `🎬 Media Preview: https://chocii-4-u.vercel.app${mediaUrl}\n\n` : ""
    }👉 *Order fresh delights now:* https://chocii-4-u.vercel.app\n\n“A Little Treat, Just for You.” ✨`;

    navigator.clipboard.writeText(formatted);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-cocoa-900 border border-caramel-500/20 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-caramel-400 text-xs font-mono font-bold tracking-widest uppercase bg-caramel-500/10 px-3 py-1 rounded-full border border-caramel-500/20">
            <Megaphone className="w-3.5 h-3.5" />
            Marketing & Customer Engagement Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-wide">
            Festival Broadcast & Offers
          </h1>
          <p className="text-sm text-cream-300/80">
            Send customized festival wishes, share picture/video media, announce discounts, and reach all customers at once.
          </p>
        </div>

        {/* Quick Audience Counter */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-cocoa-950/80 border border-white/10 px-4 py-2.5 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-caramel-500/20 border border-caramel-500/30 flex items-center justify-center text-caramel-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase text-cream-400/70 tracking-wider">
                Total Reachable Audience
              </div>
              <div className="text-lg font-bold text-white flex items-center gap-2">
                {recipients.length} Customer Contacts
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success / Error Banners */}
      {sendSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-sm flex items-center gap-3 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium">{sendSuccessMessage}</span>
        </div>
      )}

      {sendErrorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-sm flex items-center gap-3 shadow-lg animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span className="font-medium">{sendErrorMessage}</span>
        </div>
      )}

      {/* 2. Festive Quick Presets */}
      <div className="bg-cocoa-900/60 border border-white/10 p-5 rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-caramel-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            1-Click Festival & Occasion Templates
          </span>
          <span className="text-[11px] text-cream-400/60">
            Click any festival to auto-fill greeting, wishes & discount
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {FESTIVE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-cocoa-950 hover:bg-caramel-500/20 border border-white/10 hover:border-caramel-500/50 transition-all text-center space-y-1 active:scale-95"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
                {preset.emoji}
              </span>
              <span className="text-xs font-bold text-cream-100 group-hover:text-caramel-300">
                {preset.name}
              </span>
              <span className="text-[10px] text-caramel-400/80 font-mono">
                {preset.offerCode}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Studio Grid: Editor (Left) & Live Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Campaign Composer (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-cocoa-900 border border-caramel-500/20 p-6 sm:p-7 rounded-3xl space-y-5 shadow-xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
              <Sliders className="w-5 h-5 text-caramel-400" />
              Customize Broadcast Campaign
            </h2>

            {/* Campaign Title & Occasion */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-cream-300">
                  Headline / Festival Greeting
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Happy Diwali! Spread Sweet Joy with chocii 4 u"
                  className="w-full bg-cocoa-950 border border-white/10 focus:border-caramel-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-cream-400/40 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-cream-300">
                  Occasion Theme
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full bg-cocoa-950 border border-white/10 focus:border-caramel-500 rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                >
                  <option value="GENERAL">General Announcement</option>
                  <option value="DIWALI">🪔 Diwali Special</option>
                  <option value="EID">🌙 Eid Mubarak</option>
                  <option value="CHRISTMAS">🎄 Christmas & Holidays</option>
                  <option value="NEW_YEAR">🎆 New Year 2027</option>
                  <option value="HOLI">🎨 Holi Delights</option>
                  <option value="BIRTHDAY">🎂 Birthday Wish</option>
                  <option value="OFFER">⚡ Flash Offer</option>
                </select>
              </div>
            </div>

            {/* Email Subject Line */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-cream-300">
                  Email Subject Line (Includes emoji & customer name)
                </label>
                <button
                  type="button"
                  onClick={() => setSubject((prev) => `${prev} {name}`)}
                  className="text-[11px] font-mono text-caramel-400 hover:text-caramel-300"
                >
                  + Add &#123;name&#125;
                </button>
              </div>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. 🪔 Warm Diwali Wishes & Flat 25% OFF from chocii 4 u"
                className="w-full bg-cocoa-950 border border-white/10 focus:border-caramel-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-cream-400/40 outline-none"
              />
            </div>

            {/* Message Body */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-cream-300">
                  Message / Warm Greetings
                </label>
                <button
                  type="button"
                  onClick={() => setMessage((prev) => `${prev}\nDear {name}, `)}
                  className="text-[11px] font-mono text-caramel-400 hover:text-caramel-300"
                >
                  + Insert &#123;name&#125; Tag
                </button>
              </div>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your heartfelt festive greeting and offer details..."
                className="w-full bg-cocoa-950 border border-white/10 focus:border-caramel-500 rounded-xl p-4 text-sm text-white placeholder-cream-400/40 outline-none leading-relaxed"
              />
              <p className="text-[11px] text-cream-400/60">
                Tip: Use <code className="text-caramel-400">&#123;name&#125;</code> to dynamically greet each customer with their personalized real name!
              </p>
            </div>

            {/* MEDIA UPLOAD SECTION (Picture or Video) */}
            <div className="space-y-3 pt-2 pb-2 border-t border-b border-white/10">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-cream-300 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-caramel-400" />
                  Media Attachment (Picture or Video Greeting)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMediaType("image")}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors ${
                      mediaType === "image"
                        ? "bg-caramel-500 text-cocoa-950"
                        : "bg-white/5 text-cream-300 hover:bg-white/10"
                    }`}
                  >
                    <ImageIcon className="w-3 h-3" /> Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaType("video")}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors ${
                      mediaType === "video"
                        ? "bg-caramel-500 text-cocoa-950"
                        : "bg-white/5 text-cream-300 hover:bg-white/10"
                    }`}
                  >
                    <Video className="w-3 h-3" /> Video
                  </button>
                </div>
              </div>

              {/* Upload Box or Current Preview */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={mediaType === "video" ? "video/mp4,video/webm,video/quicktime" : "image/*"}
                  onChange={handleFileUpload}
                  className="hidden"
                  id="media-file-input"
                />

                <label
                  htmlFor="media-file-input"
                  className={`w-full sm:w-auto flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                    uploadingMedia
                      ? "border-caramel-500/50 bg-caramel-500/10 opacity-70"
                      : "border-white/15 hover:border-caramel-500/50 bg-cocoa-950/60 hover:bg-cocoa-950"
                  }`}
                >
                  {uploadingMedia ? (
                    <div className="flex items-center gap-2 text-caramel-400 text-sm font-medium py-2">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Uploading & caching {mediaType}...</span>
                    </div>
                  ) : (
                    <div className="text-center space-y-1">
                      <div className="w-10 h-10 rounded-full bg-caramel-500/20 text-caramel-400 flex items-center justify-center mx-auto mb-1">
                        {mediaType === "video" ? (
                          <Video className="w-5 h-5" />
                        ) : (
                          <ImageIcon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="text-xs font-bold text-white">
                        Click to select {mediaType === "video" ? "Video Greeting (.mp4, .webm)" : "Picture / Poster"}
                      </div>
                      <div className="text-[10px] text-cream-400/60 font-mono">
                        Max file size: 25MB • Stored safely in persistent database
                      </div>
                    </div>
                  )}
                </label>

                {/* Direct Link Input */}
                <div className="w-full sm:w-64 space-y-1">
                  <label className="text-[11px] font-mono text-cream-400/70">
                    Or Direct Web URL:
                  </label>
                  <input
                    type="url"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://... or /uploads/..."
                    className="w-full bg-cocoa-950 border border-white/10 focus:border-caramel-500 rounded-xl px-3 py-2 text-xs text-white placeholder-cream-400/30 outline-none"
                  />
                  {mediaUrl && (
                    <button
                      type="button"
                      onClick={() => setMediaUrl("")}
                      className="text-[10px] text-rose-400 hover:text-rose-300 font-medium"
                    >
                      Clear media attachment
                    </button>
                  )}
                </div>
              </div>

              {uploadError && (
                <div className="text-xs text-rose-400 font-medium flex items-center gap-1.5 pt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {uploadError}
                </div>
              )}
            </div>

            {/* Offer Code & Discount Voucher Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-cream-300">
                  Coupon Code
                </label>
                <input
                  type="text"
                  value={offerCode}
                  onChange={(e) => setOfferCode(e.target.value.toUpperCase().replace(/\s+/g, ""))}
                  placeholder="e.g. DIWALI25"
                  className="w-full bg-cocoa-950 border border-white/10 focus:border-caramel-500 rounded-xl px-4 py-2.5 text-sm font-mono tracking-widest text-caramel-300 placeholder-cream-400/40 outline-none font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-cream-300">
                  Discount Description
                </label>
                <input
                  type="text"
                  value={discountText}
                  onChange={(e) => setDiscountText(e.target.value)}
                  placeholder="e.g. FLAT 25% OFF ON ALL ORDERS"
                  className="w-full bg-cocoa-950 border border-white/10 focus:border-caramel-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-cream-400/40 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-cream-300">
                  Valid Till
                </label>
                <input
                  type="text"
                  value={validTill}
                  onChange={(e) => setValidTill(e.target.value)}
                  placeholder="e.g. Valid through Sunday"
                  className="w-full bg-cocoa-950 border border-white/10 focus:border-caramel-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-cream-400/40 outline-none"
                />
              </div>
            </div>

            {/* Call to Action Button & Website Banner Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-cream-300">
                  Button Text & Action
                </label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="e.g. Claim Sweet Treat"
                  className="w-full bg-cocoa-950 border border-white/10 focus:border-caramel-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-cream-300">
                  Button Link
                </label>
                <input
                  type="text"
                  value={ctaLink}
                  onChange={(e) => setCtaLink(e.target.value)}
                  placeholder="/#full-menu-section"
                  className="w-full bg-cocoa-950 border border-white/10 focus:border-caramel-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none font-mono"
                />
              </div>
            </div>

            {/* Active Storefront Switch */}
            <div className="bg-cocoa-950 p-4 rounded-2xl border border-white/10 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-caramel-400" />
                  Publish as Live Storefront Greeting & Offer
                </div>
                <div className="text-xs text-cream-400/70">
                  When enabled, all visitors browsing the website will see a top festive banner and this celebration greeting modal.
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={isActiveBanner}
                  onChange={(e) => setIsActiveBanner(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-caramel-500"></div>
              </label>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleSaveCampaign}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all border border-white/10"
              >
                Save Campaign Draft
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCopyWhatsAppText}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all"
                  title="Copy formatted message for WhatsApp Broadcast list"
                >
                  {copiedWhatsApp ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedWhatsApp ? "Copied!" : "Copy for WhatsApp"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* BROADCAST DISPATCH CONTROLS */}
          <div className="bg-gradient-to-br from-cocoa-900 to-cocoa-950 border border-caramel-500/30 p-6 sm:p-7 rounded-3xl space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Send className="w-4 h-4 text-caramel-400" />
                  Dispatch Broadcast to Customers
                </h3>
                <p className="text-xs text-cream-300/70">
                  Sends personalized emails with your festive media, coupon code & greetings to all contacts at once.
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-caramel-500/20 text-caramel-300 border border-caramel-500/30 px-3 py-1 rounded-full">
                {recipients.length} Recipients
              </span>
            </div>

            {/* Test Email Section */}
            <div className="bg-cocoa-950/80 p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center gap-3">
              <div className="w-full sm:w-auto flex-1 space-y-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-cream-400">
                  Send Test Preview to Admin First:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-cream-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={testEmailAddress}
                    onChange={(e) => setTestEmailAddress(e.target.value)}
                    placeholder="admin email"
                    className="w-full bg-cocoa-900 border border-white/10 focus:border-caramel-500 rounded-xl pl-10 pr-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                disabled={isSending}
                onClick={() => handleSendBroadcast(true)}
                className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/10 transition-all self-end disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-caramel-400" />
                Send Test Preview
              </button>
            </div>

            {/* Live Progress Bar if sending */}
            {isSending && sendingProgress && (
              <div className="space-y-2 p-4 rounded-2xl bg-caramel-500/10 border border-caramel-500/30">
                <div className="flex items-center justify-between text-xs font-bold text-caramel-300">
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-caramel-400" />
                    {sendingProgress.status}
                  </span>
                  <span>100% In Progress</span>
                </div>
                <div className="w-full bg-cocoa-950 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-caramel-500 to-caramel-400 rounded-full animate-pulse w-full" />
                </div>
              </div>
            )}

            {/* Send to ALL Button */}
            <div className="pt-2">
              <button
                type="button"
                disabled={isSending}
                onClick={() => handleSendBroadcast(false)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-caramel-500 via-caramel-600 to-caramel-500 hover:from-caramel-400 hover:to-caramel-500 text-cocoa-950 font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl shadow-caramel-500/25 transition-all active:scale-98 disabled:opacity-50"
              >
                <Megaphone className="w-5 h-5 text-cocoa-950" />
                <span>
                  {isSending
                    ? "Dispatching Emails in Background..."
                    : `Broadcast to All ${recipients.length} Customers Now`}
                </span>
              </button>
              <div className="text-center pt-2 text-[11px] text-cream-400/60">
                Uses verified free Gmail SMTP sender • Dispatches with customized names & celebratory layout
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Visual Preview Studio (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-6 space-y-4">
            {/* Preview Mode Switcher */}
            <div className="bg-cocoa-900 border border-white/10 p-1.5 rounded-2xl flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPreviewMode("email")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  previewMode === "email"
                    ? "bg-caramel-500 text-cocoa-950 shadow-md"
                    : "text-cream-300 hover:text-white"
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                Email Preview
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("popup")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  previewMode === "popup"
                    ? "bg-caramel-500 text-cocoa-950 shadow-md"
                    : "text-cream-300 hover:text-white"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Storefront Modal Preview
              </button>
            </div>

            {/* PREVIEW CONTAINER */}
            <div className="bg-cocoa-950 border border-caramel-500/20 rounded-3xl p-4 shadow-2xl overflow-hidden">
              <div className="text-[11px] font-mono text-cream-400/60 uppercase tracking-widest text-center pb-3 border-b border-white/10 flex items-center justify-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-caramel-400" />
                Live Customer Screen Rendering
              </div>

              {previewMode === "email" ? (
                /* 1. HTML Email Preview Simulator */
                <div className="mt-3 bg-[#FAF7F2] text-cocoa-950 rounded-2xl overflow-hidden border border-[#EADCCE] shadow-md font-sans">
                  {/* Email Header */}
                  <div className="bg-gradient-to-r from-[#1C0F0C] via-[#2E1712] to-[#421F17] text-white p-5 text-center">
                    <span className="inline-block bg-caramel-500/20 border border-caramel-500/40 text-caramel-200 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-1">
                      ✨ {occasion} CELEBRATION
                    </span>
                    <h3 className="font-serif font-black text-xl tracking-wider text-white lowercase">
                      chocii 4 u
                    </h3>
                    <div className="text-[10px] italic text-caramel-400">
                      A Little Treat, Just for You.
                    </div>
                  </div>

                  {/* Media Banner */}
                  {mediaUrl && (
                    <div className="bg-black text-center overflow-hidden">
                      {mediaType === "video" ? (
                        <div className="p-4 bg-[#2A140E] text-center border-b border-white/10">
                          <p className="text-xs text-caramel-200 font-semibold mb-2">
                            🎬 Festive Video Greeting from our Kitchen
                          </p>
                          <div className="inline-flex items-center gap-1.5 bg-caramel-500 text-cocoa-950 font-bold text-xs px-3 py-1.5 rounded-full shadow">
                            <Play className="w-3 h-3 fill-current" /> Watch Video
                          </div>
                        </div>
                      ) : (
                        <img
                          src={mediaUrl}
                          alt={title}
                          className="w-full max-h-48 object-cover"
                        />
                      )}
                    </div>
                  )}

                  {/* Email Body */}
                  <div className="p-5 space-y-3">
                    <h4 className="font-serif font-bold text-base text-cocoa-950 leading-snug">
                      {title}
                    </h4>
                    <p className="text-xs text-cocoa-900/80 whitespace-pre-wrap leading-relaxed">
                      {message
                        .replace(/\{name\}/gi, "Suresh")
                        .replace(/\{\{name\}\}/gi, "Suresh")}
                    </p>

                    {/* Offer Voucher Box */}
                    {offerCode && (
                      <div className="bg-[#FFF9F3] border-2 border-dashed border-[#C58A55] rounded-xl p-3 text-center space-y-1">
                        <div className="text-[10px] font-bold tracking-wider text-[#8C532B] uppercase">
                          🎁 Festive Coupon Voucher
                        </div>
                        {discountText && (
                          <div className="text-sm font-black text-cocoa-950">
                            {discountText}
                          </div>
                        )}
                        <div className="inline-block bg-[#24130F] text-[#F8D7B5] font-mono font-bold text-sm tracking-widest px-3 py-1 rounded-lg">
                          {offerCode}
                        </div>
                        {validTill && (
                          <div className="text-[10px] text-[#7A5348]">
                            ⏰ {validTill}
                          </div>
                        )}
                      </div>
                    )}

                    {/* CTA Button */}
                    <div className="text-center pt-2">
                      <div className="inline-block bg-gradient-to-r from-[#C58A55] to-[#9E5B26] text-white font-bold text-xs px-5 py-2.5 rounded-full shadow">
                        {ctaText} →
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F7EFE6] border-t border-[#EADCCE] p-3 text-center text-[10px] text-[#7A5348]">
                    Crafted with love at chocii 4 u Artisanal Kitchen • Visakhapatnam
                  </div>
                </div>
              ) : (
                /* 2. Storefront Modal Simulator */
                <div className="mt-3 bg-cocoa-900 border border-caramel-500/30 rounded-2xl overflow-hidden shadow-xl text-cream-100">
                  {mediaUrl ? (
                    <div className="bg-black relative">
                      {mediaType === "video" ? (
                        <video
                          src={mediaUrl}
                          controls
                          autoPlay
                          muted
                          loop
                          className="w-full max-h-44 object-cover"
                        />
                      ) : (
                        <img
                          src={mediaUrl}
                          alt={title}
                          className="w-full max-h-44 object-cover"
                        />
                      )}
                      <div className="absolute top-2 right-2 bg-black/60 p-1 rounded-full text-white/70">
                        <X className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-gradient-to-r from-caramel-600/30 to-cocoa-950 text-center relative">
                      <div className="text-xs font-bold text-caramel-300 uppercase">
                        ✨ {occasion}
                      </div>
                      <div className="font-serif text-lg font-black text-white mt-1">
                        {title}
                      </div>
                    </div>
                  )}

                  <div className="p-4 space-y-3">
                    <h5 className="font-bold text-sm text-white">{title}</h5>
                    <p className="text-xs text-cream-200/80 leading-relaxed whitespace-pre-wrap">
                      {message
                        .replace(/\{name\}/gi, "Foodie Friend")
                        .replace(/\{\{name\}\}/gi, "Foodie Friend")}
                    </p>

                    {offerCode && (
                      <div className="bg-cocoa-950 border-2 border-dashed border-caramel-500/50 rounded-xl p-3 text-center space-y-1">
                        <div className="text-[10px] font-bold text-caramel-400 uppercase">
                          🎁 Exclusive Festive Voucher
                        </div>
                        {discountText && (
                          <div className="text-xs font-black text-white">
                            {discountText}
                          </div>
                        )}
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="bg-cocoa-900 border border-caramel-500/50 text-caramel-300 font-mono text-xs font-bold px-2 py-0.5 rounded">
                            {offerCode}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(offerCode);
                              setCopiedCodePreview(true);
                              setTimeout(() => setCopiedCodePreview(false), 2000);
                            }}
                            className="bg-caramel-500 text-cocoa-950 text-[10px] font-bold px-2 py-0.5 rounded"
                          >
                            {copiedCodePreview ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="pt-1">
                      <div className="w-full bg-caramel-500 text-cocoa-950 font-bold text-xs py-2.5 rounded-xl text-center shadow">
                        {ctaText} →
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Past Broadcast Campaigns History */}
      <div className="bg-cocoa-900 border border-caramel-500/20 p-6 sm:p-7 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-caramel-400" />
              Broadcast Campaigns History
            </h3>
            <p className="text-xs text-cream-300/70">
              Manage previous broadcasts, toggle storefront banners, and view delivery metrics.
            </p>
          </div>
          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-cream-300 transition-colors"
            title="Refresh history"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {broadcasts.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <Megaphone className="w-8 h-8 text-caramel-500/40 mx-auto" />
            <p className="text-sm font-medium text-cream-400/80">No broadcast campaigns created yet.</p>
            <p className="text-xs text-cream-400/50">
              Choose a festival preset above and click "Save Campaign Draft" or "Broadcast to All Customers".
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5 overflow-x-auto">
            {broadcasts.map((camp) => (
              <div
                key={camp.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 px-3 rounded-2xl transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  {camp.mediaUrl ? (
                    <div className="w-14 h-14 rounded-xl bg-black border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                      {camp.mediaType === "video" ? (
                        <Video className="w-6 h-6 text-caramel-400" />
                      ) : (
                        <img
                          src={camp.mediaUrl}
                          alt={camp.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-caramel-500/20 border border-caramel-500/30 flex items-center justify-center text-caramel-400 shrink-0 font-bold text-xs uppercase font-mono">
                      {camp.occasion.slice(0, 3)}
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{camp.title}</span>
                      {camp.isActiveBanner && (
                        <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <Radio className="w-2.5 h-2.5 animate-pulse" /> Live Banner
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-cream-300/70 truncate max-w-md">
                      {camp.subject}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-cream-400/60">
                      <span>Occasion: {camp.occasion}</span>
                      {camp.offerCode && <span>Code: {camp.offerCode}</span>}
                      <span>Sent: {camp.sentEmailCount} emails</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleToggleBanner(camp.id, camp.isActiveBanner)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                      camp.isActiveBanner
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
                        : "bg-white/5 text-cream-400 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {camp.isActiveBanner ? "Deactivate Banner" : "Set as Live Banner"}
                  </button>

                  <button
                    onClick={() => {
                      setTitle(camp.title);
                      setSubject(camp.subject);
                      setMessage(camp.message);
                      setOccasion(camp.occasion);
                      if (camp.mediaUrl) setMediaUrl(camp.mediaUrl);
                      if (camp.mediaType) setMediaType(camp.mediaType);
                      if (camp.offerCode) setOfferCode(camp.offerCode);
                      if (camp.discountText) setDiscountText(camp.discountText);
                      if (camp.validTill) setValidTill(camp.validTill);
                      if (camp.ctaText) setCtaText(camp.ctaText);
                      if (camp.ctaLink) setCtaLink(camp.ctaLink);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-cream-300 hover:text-white transition-colors"
                    title="Load into editor"
                  >
                    <Sliders className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteCampaign(camp.id, camp.title)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                    title="Delete campaign"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
