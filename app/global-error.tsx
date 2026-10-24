"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Utensils } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: "#150A08", color: "#FFF5E9", fontFamily: "sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", textAlign: "center" }}>
          <div style={{ maxWidth: "420px", width: "100%", background: "#21100C", border: "1px solid rgba(217, 160, 102, 0.3)", borderRadius: "24px", padding: "32px", boxSizing: "border-box" }}>
            <div style={{ width: "56px", height: "56px", margin: "0 auto 16px", borderRadius: "50%", background: "rgba(217, 160, 102, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#D9A066" }}>
              <Utensils size={28} />
            </div>

            <h1 style={{ fontSize: "24px", margin: "0 0 8px", color: "#FFF5E9" }}>
              chocii 4 u
            </h1>
            <p style={{ fontSize: "14px", color: "rgba(255, 245, 233, 0.7)", margin: "0 0 20px", lineHeight: "1.5" }}>
              A temporary interruption occurred while loading our dessert kitchen.
            </p>

            {error?.digest && (
              <p style={{ fontSize: "11px", fontFamily: "monospace", color: "rgba(255, 245, 233, 0.4)", margin: "0 0 20px" }}>
                Digest: {error.digest}
              </p>
            )}

            <button
              onClick={() => reset()}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "9999px",
                backgroundColor: "#D9A066",
                color: "#150A08",
                fontWeight: "bold",
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                border: "none",
                cursor: "pointer",
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
