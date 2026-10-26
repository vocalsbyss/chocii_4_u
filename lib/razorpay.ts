import crypto from "crypto";
import prisma from "@/lib/prisma";

export interface RazorpayOrderResult {
  isConfigured: boolean;
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface StoreUpiDetails {
  upiId: string;
  upiName: string;
}

export async function getRazorpayCredentials(): Promise<{
  keyId: string;
  keySecret: string;
} | null> {
  // 1. Check process.env first
  if (
    process.env.RAZORPAY_KEY_ID &&
    process.env.RAZORPAY_KEY_SECRET &&
    process.env.RAZORPAY_KEY_ID.trim().startsWith("rzp_")
  ) {
    return {
      keyId: process.env.RAZORPAY_KEY_ID.trim(),
      keySecret: process.env.RAZORPAY_KEY_SECRET.trim(),
    };
  }

  // 2. Check database StoreSetting
  try {
    const settings = await prisma.storeSetting.findMany({
      where: {
        key: { in: ["razorpayKeyId", "razorpayKeySecret"] },
      },
    });
    const keyMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    if (
      keyMap.razorpayKeyId &&
      keyMap.razorpayKeySecret &&
      keyMap.razorpayKeyId.trim().startsWith("rzp_")
    ) {
      return {
        keyId: keyMap.razorpayKeyId.trim(),
        keySecret: keyMap.razorpayKeySecret.trim(),
      };
    }
  } catch (err) {
    console.warn("Could not query razorpay settings from database:", err);
  }

  return null;
}

export async function getStoreUpiDetails(): Promise<StoreUpiDetails> {
  try {
    const settings = await prisma.storeSetting.findMany({
      where: {
        key: { in: ["storeUpiId", "storeUpiName", "brandName", "contactPhone"] },
      },
    });
    const keyMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    const upiId =
      keyMap.storeUpiId?.trim() ||
      process.env.STORE_UPI_ID?.trim() ||
      "8688367177@okbizaxis";
    const upiName =
      keyMap.storeUpiName?.trim() ||
      keyMap.brandName?.trim() ||
      "chocii 4 u";
    return { upiId, upiName };
  } catch {
    return {
      upiId: process.env.STORE_UPI_ID || "8688367177@okbizaxis",
      upiName: "chocii 4 u",
    };
  }
}

export async function isRazorpayConfigured(): Promise<boolean> {
  const creds = await getRazorpayCredentials();
  return Boolean(creds);
}

export async function createRazorpayOrder(
  amountInINR: number,
  receipt: string
): Promise<RazorpayOrderResult> {
  const creds = await getRazorpayCredentials();
  const amountInPaise = Math.round(amountInINR * 100);

  if (!creds) {
    // Development / Test mode placeholder
    return {
      isConfigured: false,
      orderId: `test_order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      amount: amountInPaise,
      currency: "INR",
      keyId: "rzp_test_placeholder",
    };
  }

  const { keyId, keySecret } = creds;
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: "INR",
      receipt,
      payment_capture: 1,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Razorpay order creation failed:", errorText);
    throw new Error(`Razorpay order creation failed: ${errorText}`);
  }

  const data = await res.json();
  return {
    isConfigured: true,
    orderId: data.id,
    amount: data.amount,
    currency: data.currency,
    keyId,
  };
}

export async function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> {
  const creds = await getRazorpayCredentials();
  if (!creds) {
    // In test/dev mode without credentials, allow developer testing
    return signature === "test_signature" || signature.startsWith("dev_");
  }

  const text = `${orderId}|${paymentId}`;
  const generatedSignature = crypto
    .createHmac("sha256", creds.keySecret)
    .update(text)
    .digest("hex");

  return generatedSignature === signature;
}
