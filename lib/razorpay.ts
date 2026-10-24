import crypto from "crypto";

export interface RazorpayOrderResult {
  isConfigured: boolean;
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export function isRazorpayConfigured(): boolean {
  return Boolean(
    process.env.RAZORPAY_KEY_ID &&
      process.env.RAZORPAY_KEY_SECRET &&
      process.env.RAZORPAY_KEY_ID.startsWith("rzp_")
  );
}

export async function createRazorpayOrder(
  amountInINR: number,
  receipt: string
): Promise<RazorpayOrderResult> {
  const isConfigured = isRazorpayConfigured();
  const amountInPaise = Math.round(amountInINR * 100);

  if (!isConfigured) {
    // Development / Test mode placeholder
    return {
      isConfigured: false,
      orderId: `test_order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      amount: amountInPaise,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
    };
  }

  const key = process.env.RAZORPAY_KEY_ID!;
  const secret = process.env.RAZORPAY_KEY_SECRET!;
  const auth = Buffer.from(`${key}:${secret}`).toString("base64");

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
    throw new Error(`Razorpay order creation failed: ${errorText}`);
  }

  const data = await res.json();
  return {
    isConfigured: true,
    orderId: data.id,
    amount: data.amount,
    currency: data.currency,
    keyId: key,
  };
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (!isRazorpayConfigured()) {
    // In test/dev mode without credentials, allow developer testing if signature is "test_signature"
    return signature === "test_signature" || signature.startsWith("dev_");
  }

  const secret = process.env.RAZORPAY_KEY_SECRET!;
  const text = `${orderId}|${paymentId}`;
  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(text)
    .digest("hex");

  return generatedSignature === signature;
}
