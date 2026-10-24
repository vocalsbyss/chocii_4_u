import React, { Suspense } from "react";
import SignInPage from "../sign-in/page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In with Phone OTP | chocii 4 u",
  description: "Sign in with your Indian mobile number to order desserts, customize options, and track deliveries.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cocoa-950 flex items-center justify-center text-caramel-400">Loading sign in...</div>}>
      <SignInPage />
    </Suspense>
  );
}
