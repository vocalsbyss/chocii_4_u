"use client";

import React, { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function TrafficTrackerContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPathRef = useRef<string>("");

  useEffect(() => {
    if (!pathname) return;

    // Do not track admin portal visits or api requests
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    const fullPath = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    // Prevent immediate duplicate fires for the same path
    if (lastTrackedPathRef.current === fullPath) {
      return;
    }
    lastTrackedPathRef.current = fullPath;

    try {
      // Get or create persistent visitor ID
      let visitorId = "";
      if (typeof window !== "undefined") {
        visitorId = localStorage.getItem("chocii_vid") || "";
        if (!visitorId) {
          visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
          localStorage.setItem("chocii_vid", visitorId);
        }
      }

      // Detect device
      const width = typeof window !== "undefined" ? window.innerWidth : 375;
      const device = width < 768 ? "mobile" : width < 1024 ? "tablet" : "desktop";

      // Detect browser
      let browser = "Mobile Safari";
      if (typeof navigator !== "undefined") {
        const ua = navigator.userAgent;
        if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
        else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
        else if (ua.includes("Firefox")) browser = "Firefox";
        else if (ua.includes("Edg")) browser = "Edge";
      }

      const referrer = typeof document !== "undefined" ? document.referrer : "";

      const payload = {
        path: fullPath,
        visitorId,
        device,
        browser,
        referrer,
      };

      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // Silent error handling for analytics
    }
  }, [pathname, searchParams]);

  return null;
}

export default function TrafficTracker() {
  return (
    <Suspense fallback={null}>
      <TrafficTrackerContent />
    </Suspense>
  );
}
