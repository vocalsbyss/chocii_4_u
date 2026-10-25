import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import TrafficTracker from "@/components/analytics/TrafficTracker";
import FestivalBroadcastModal from "@/components/ui/FestivalBroadcastModal";
import { PreviewProvider } from "@/components/preview/PreviewContext";
import GlobalPreviewBar from "@/components/preview/GlobalPreviewBar";
import prisma from "@/lib/prisma";
import "./globals.css";

export const metadata: Metadata = {
  title: "chocii 4 u — A Little Treat, Just for You.",
  description:
    "A Little Treat, Just for You. Explore our tempting collection of chocolate treats, layered cakes, churros, and dessert creations.",
  keywords: [
    "chocii 4 u",
    "Chocii 4 U",
    "Dream Cake",
    "Desserts",
    "Cloud Kitchen",
    "Churros",
    "Brownie Bowl",
    "Artisanal Chocolate",
  ],
  authors: [{ name: "chocii 4 u" }],
  openGraph: {
    title: "chocii 4 u — A Little Treat, Just for You.",
    description: "A Little Treat, Just for You. Explore our delicious chocolate treats and desserts delivered to your door.",
    url: "https://chocii4u.com",
    siteName: "chocii 4 u",
    locale: "en_IN",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "chocii 4 u",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/images/chocii-logo-round.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  formatDetection: {
    telephone: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let homepageStyle = "classic";
  try {
    const setting = await prisma.storeSetting.findUnique({
      where: { key: "homepage_style" },
    });
    if (setting?.value) {
      homepageStyle = setting.value;
    }
  } catch (e) {}

  return (
    <html lang="en" className="light overflow-x-hidden max-w-full w-full" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var t = localStorage.getItem('cravings_theme');
                if (t === 'dark') {
                  document.documentElement.classList.remove('light');
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                }
              } catch (e) {}
            })();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-[#FAF7F2] text-cocoa-950 antialiased font-sans overflow-x-hidden max-w-full w-full">
        <PreviewProvider initialOfficialStyle={homepageStyle}>
          <ThemeProvider>
            <GlobalPreviewBar />
            <FestivalBroadcastModal />
            <TrafficTracker />
            {children}
          </ThemeProvider>
        </PreviewProvider>
        {/* Razorpay Script for optional client-side modal checkout */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
