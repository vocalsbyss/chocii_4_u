"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface PreviewContextType {
  isPreviewActive: boolean;
  isOfficialCoolDock: boolean;
  togglePreview: () => void;
  enablePreview: () => void;
  undoPreview: () => void;
  makePermanent: () => Promise<boolean>;
}

const PreviewContext = createContext<PreviewContextType>({
  isPreviewActive: false,
  isOfficialCoolDock: false,
  togglePreview: () => {},
  enablePreview: () => {},
  undoPreview: () => {},
  makePermanent: async () => false,
});

export function PreviewProvider({
  children,
  initialOfficialStyle = "classic",
}: {
  children: React.ReactNode;
  initialOfficialStyle?: string;
}) {
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [isOfficialCoolDock, setIsOfficialCoolDock] = useState(
    initialOfficialStyle === "cooldock"
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check URL parameters, cookies, or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const paramPreview = urlParams.get("preview");

    if (paramPreview === "1" || paramPreview === "cooldock" || paramPreview === "true") {
      setIsPreviewActive(true);
      try {
        localStorage.setItem("cravings_preview_mode", "true");
        document.cookie = "cravings_preview_mode=true; path=/; max-age=604800";
      } catch (e) {}
    } else if (paramPreview === "0" || paramPreview === "false") {
      setIsPreviewActive(false);
      try {
        localStorage.removeItem("cravings_preview_mode");
        document.cookie = "cravings_preview_mode=false; path=/; max-age=604800";
      } catch (e) {}
    } else {
      // Check stored preference
      try {
        const stored = localStorage.getItem("cravings_preview_mode");
        if (stored === "true") {
          setIsPreviewActive(true);
        }
      } catch (e) {}
    }
  }, []);

  const enablePreview = () => {
    setIsPreviewActive(true);
    try {
      localStorage.setItem("cravings_preview_mode", "true");
      document.cookie = "cravings_preview_mode=true; path=/; max-age=604800";
    } catch (e) {}
  };

  const undoPreview = async () => {
    setIsPreviewActive(false);
    setIsOfficialCoolDock(false);
    try {
      localStorage.removeItem("cravings_preview_mode");
      document.cookie = "cravings_preview_mode=false; path=/; max-age=604800";
      // Also notify backend if this was permanent
      await fetch("/api/preview/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ style: "classic" }),
      });
    } catch (e) {}
  };

  const togglePreview = () => {
    if (isPreviewActive) {
      undoPreview();
    } else {
      enablePreview();
    }
  };

  const makePermanent = async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/preview/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ style: "cooldock" }),
      });
      if (res.ok) {
        setIsOfficialCoolDock(true);
        setIsPreviewActive(false); // No longer in preview, now official!
        localStorage.removeItem("cravings_preview_mode");
        return true;
      }
    } catch (e) {
      console.error("Failed to make CoolDock style permanent:", e);
    }
    return false;
  };

  return (
    <PreviewContext.Provider
      value={{
        isPreviewActive: mounted ? isPreviewActive : false,
        isOfficialCoolDock,
        togglePreview,
        enablePreview,
        undoPreview,
        makePermanent,
      }}
    >
      {children}
    </PreviewContext.Provider>
  );
}

export function usePreview() {
  return useContext(PreviewContext);
}
