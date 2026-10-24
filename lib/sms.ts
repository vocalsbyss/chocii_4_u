/**
 * Multi-carrier SMS Dispatch Service for chocii 4 u.
 * Supports:
 *  1. Fast2SMS (Indian carrier OTP direct route)
 *  2. Twilio (Global carrier SMS)
 *  3. Msg91 (Indian DLT/OTP API)
 *  4. Secure Console logger for local/dev fallback
 */

export interface SendSmsResult {
  success: boolean;
  provider: "fast2sms" | "twilio" | "msg91" | "development";
  messageId?: string;
  error?: string;
}

export async function sendVerificationSms(
  rawDigits: string,
  normalizedPhone: string,
  otpCode: string
): Promise<SendSmsResult> {
  const brandName = "chocii 4 u";
  const messageText = `Your ${brandName} verification code is: ${otpCode}. Valid for 15 minutes. Do not share this code with anyone.`;

  // 1. Check Fast2SMS (India OTP route)
  if (process.env.FAST2SMS_API_KEY) {
    try {
      const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          route: "otp",
          variables_values: otpCode,
          numbers: rawDigits,
        }),
      });

      const data = await res.json().catch(() => null);
      if (res.ok && data?.return) {
        return {
          success: true,
          provider: "fast2sms",
          messageId: data?.request_id,
        };
      }
      console.warn("[Fast2SMS] Response status:", res.status, data);
    } catch (err) {
      console.error("[Fast2SMS] Network error:", err);
    }
  }

  // 2. Check Twilio (Global carrier)
  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  ) {
    try {
      const sid = process.env.TWILIO_ACCOUNT_SID;
      const auth = Buffer.from(
        `${sid}:${process.env.TWILIO_AUTH_TOKEN}`
      ).toString("base64");

      const res = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${auth}`,
          },
          body: new URLSearchParams({
            To: normalizedPhone,
            From: process.env.TWILIO_PHONE_NUMBER,
            Body: messageText,
          }),
        }
      );

      const twilioData = await res.json().catch(() => null);
      if (res.ok && twilioData?.sid) {
        return {
          success: true,
          provider: "twilio",
          messageId: twilioData.sid,
        };
      }
      console.warn("[Twilio] SMS dispatch response:", res.status, twilioData);
    } catch (err) {
      console.error("[Twilio] SMS dispatch error:", err);
    }
  }

  // 3. Check Msg91 (India DLT/OTP API)
  if (process.env.MSG91_AUTH_KEY && process.env.MSG91_TEMPLATE_ID) {
    try {
      const url = `https://control.msg91.com/api/v5/otp?template_id=${encodeURIComponent(
        process.env.MSG91_TEMPLATE_ID
      )}&mobile=91${rawDigits}&authkey=${encodeURIComponent(
        process.env.MSG91_AUTH_KEY
      )}&otp=${otpCode}`;

      const res = await fetch(url, { method: "POST" });
      const msg91Data = await res.json().catch(() => null);
      if (res.ok && (msg91Data?.type === "success" || msg91Data?.message)) {
        return {
          success: true,
          provider: "msg91",
          messageId: msg91Data?.message,
        };
      }
      console.warn("[Msg91] OTP response:", res.status, msg91Data);
    } catch (err) {
      console.error("[Msg91] OTP error:", err);
    }
  }

  // 4. Fallback: Log to secure server console
  console.log(
    `\n========================================\n[CHOCII 4 U SMS MESSAGE DISPATCH]\nRecipient : ${normalizedPhone} (${rawDigits})\nOTP Code  : ${otpCode}\nMessage   : "${messageText}"\n========================================\n`
  );

  return {
    success: true,
    provider: "development",
  };
}
